
const Course = require("../models/Course");
const {multipleMongoosesToObject} = require("../../util/mongoose")

class MeController {
    storedCourses(req, res, next){
        Course.find({})
        .then((courses) => {
            res.render("me/stored-courses", {courses: multipleMongoosesToObject(courses)})
        })
        .catch(next)
    }

}
module.exports = new MeController;