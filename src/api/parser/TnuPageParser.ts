import cheerio from "cheerio";

import IAbsentParser from "../../interface/tnu/IAbsentParser";
import IAskForLeaveParser from "../../interface/tnu/IAskForLeaveParser";
import ICourseParser from "../../interface/tnu/ICourseParser";
import IGradesParser from "../../interface/tnu/IGradesParser";
import IRewardsPunishmentParser from "../../interface/tnu/IRewardsPunishmentParser";

export default class TnuPageParser {

    public homePageParser(page: string): { studentId: string, name: string } {

        const $ = cheerio.load(page);
        const studentUserSplit = $(".fa-user").text().replace(" ", "").split("_");

        return {
            studentId: studentUserSplit[1],
            name: studentUserSplit[0]
        }
    }

    public absentPageParser(page: string): Array<IAbsentParser> {

        const absents = new Array<IAbsentParser>();
        const $ = cheerio.load(page);

        $("body > div:nth-child(9) > table > tbody > tr").each((index, element) => {

            let $ = cheerio.load(element);

            let coursesElement = Array.from($("table > tbody > tr", $("td:nth-child(5)")));
            let course = new Array();

            for (let courseElement of coursesElement) {

                let $ = cheerio.load(courseElement);

                for (let td of $("td")) {

                    let $ = cheerio.load(td);

                    let description = () => {
                        let value = $("input").attr("value") as string;
                        return cheerio.load(value).text();
                    }

                    course.push({
                        status: $("span").attr("style") === "color:white;",
                        section: $.text().replace(/[^0-9]/ig, ""),
                        description: description()
                    })
                }
            }

            absents.push({
                year: $("td:nth-child(1)").text(),
                semester: $("td:nth-child(2)").text(),
                absent: $("td:nth-child(3)").text(),
                date: $("td:nth-child(4)").text(),
                course: course
            });
        });

        return absents;
    }

    public coursePageParser(page: string): Array<ICourseParser> {

        const coursesData = new Array();
        let $ = cheerio.load(page);

        $("body > div > div > div > div:nth-child(1) > table:nth-child(3) > tbody > tr").each((index, element) => {

            let festivalNumber = $("td:nth-child(1)", element).text();
            let regionalTime = $("td:nth-child(2)", element).text().split("|");
            let mondayCourse = ($("td:nth-child(3)", element).html() as string).split("<br>");
            let tuesdayCourse = ($("td:nth-child(4)", element).html() as string).split("<br>");
            let wednesdayCourse = ($("td:nth-child(5)", element).html() as string).split("<br>");
            let thursdayCoures = ($("td:nth-child(6)", element).html() as string).split("<br>");
            let fridayCoures = ($("td:nth-child(7)", element).html() as string).split("<br>");

            coursesData.push({
                festivalNumber: festivalNumber,
                regionalTime: regionalTime,
                week: {
                    mondayCourse: mondayCourse.length === 3 ? {
                        name: mondayCourse[0],
                        teacher: mondayCourse[1],
                        place: mondayCourse[2]
                    } : "undefined",
                    tuesdayCourse: tuesdayCourse.length === 3 ? {
                        name: tuesdayCourse[0],
                        teacher: tuesdayCourse[1],
                        place: tuesdayCourse[2]
                    } : "undefined",
                    wednesdayCourse: wednesdayCourse.length === 3 ? {
                        name: wednesdayCourse[0],
                        teacher: wednesdayCourse[1],
                        place: wednesdayCourse[2]
                    } : "undefined",
                    thursdayCoures: thursdayCoures.length === 3 ? {
                        name: thursdayCoures[0],
                        teacher: thursdayCoures[1],
                        place: thursdayCoures[2]
                    } : "undefined",
                    fridayCoures: fridayCoures.length === 3 ? {
                        name: fridayCoures[0],
                        teacher: fridayCoures[1],
                        place: fridayCoures[2]
                    } : "undefined"
                }
            });
        });

        return coursesData;
    }

    public getStudentIdCoursePageParser(page: string): string {

        const $ = cheerio.load(page);
        const studentId = $("body > form:nth-child(2) > div > table > tbody > tr > td:nth-child(2) > input[type=hidden]").attr("value") as string;

        return studentId;
    }

    public gradesPageParser(page: string): Array<IGradesParser> {

        const grades = new Array();
        let $ = cheerio.load(page);

        $("body > form > div:nth-child(3) > table:nth-child(2) > tbody > tr").each((index, element) => {

            let courseCategory = $("td:nth-child(2)", element).text();
            let courseName = $("td:nth-child(3)", element).text().split("]")[1];
            let teacher = $("td:nth-child(4)", element).text();

            let fraction = $("td:nth-child(5)", element).text();
            if (fraction.length <= 0) {
                fraction = $("td:nth-child(5) > span", element).text().replace("*", "");
            }

            let pass = fraction.indexOf("*") !== 0;
            fraction = fraction.replace("*", "");

            let credit = $("td:nth-child(6)", element).text();

            grades.push({
                courseCategory: courseCategory,
                courseName: courseName,
                teacher: teacher,
                fraction: fraction,
                credit: credit,
                pass: pass
            });
        });

        return grades;
    }

    public askForLeavePageParser(page: string): Array<IAskForLeaveParser> {

        const askForLeaves = new Array();
        let $ = cheerio.load(page);

        $("body > div:nth-child(8) > table > tbody > tr").each((index, element) => {

            if ($("td", element).length >= 2) {

                let dataUrl = $("td:nth-child(1) > a", element).attr("href");
                let type = $("td:nth-child(2)", element).text();
                let cause = $("td:nth-child(3) > textarea", element).text();
                let date = ($("td:nth-child(4) > span", element).html() as string).split("&")[0];

                let section = new Array<any>();
                $("td:nth-child(4) > span > span", element).each((index, element) => {
                    section.push($(element).text());
                });

                let festivalNumber = $("td:nth-child(5)", element).text();
                let status = $("td:nth-child(6) > span", element).text();

                askForLeaves.push({
                    dataUrl: dataUrl,
                    type: type,
                    cause: cause,
                    date: date,
                    sections: section,
                    festivalNumber: Number(festivalNumber),
                    status: status
                });
            }
        });

        return askForLeaves;
    }

    public rewardsPunishmentPageParser(page: string): Array<IRewardsPunishmentParser> {

        const rewardsPunishment = new Array();
        let $ = cheerio.load(page);

        $("body > form > div:nth-child(2) > table > tbody > tr").each((index, element) => {

            let schoolYear = $("td:nth-child(1)", element).text();
            let semester = $("td:nth-child(2)", element).text();
            let type = $("td:nth-child(3)", element).text();
            let supportNumber = $("td:nth-child(4)", element).text();
            let effectiveDate = $("td:nth-child(5)", element).text();
            let clause = $("td:nth-child(9)", element).text();
            let description = $("td:nth-child(10)", element).text();
            let correct = $("td:nth-child(11)", element).text();

            rewardsPunishment.push({
                schoolYear: schoolYear,
                semester: semester,
                type: type,
                supportNumber: supportNumber,
                effectiveDate: effectiveDate,
                clause: clause,
                description: description,
                correct: correct
            });
        });

        return rewardsPunishment;
    }
}
