
const Course = require("../models/Course");
const {multipleMongoosesToObject} = require("../../util/mongoose")

class MeController {
    storedCourses(req, res, next){
        // Course.find({})
        // .then((courses) => {
        // })
        // .catch(next)
        Promise.all([Course.find({}), Course.countDocumentsDeleted()]).
        then(([courses, deletedCount]) =>{
            res.render("me/stored-courses", {
                deletedCount,
                courses: multipleMongoosesToObject(courses)
            })

        })
        .catch(next);
    }

    // [GET] me/trash/courses
    trashCourses(req, res, next){
        Course.findDeleted({})
        .then((courses) => {
            res.render("me/trash-courses", {courses: multipleMongoosesToObject(courses)})
        })
        .catch(next)
    }

}
module.exports = new MeController;