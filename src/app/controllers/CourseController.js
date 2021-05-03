const Course = require("../models/Course");
const { mongooseToObject } = require("../../util/mongoose");

class CourseController {
  show(req, res, next) {
    console.log(req.params)
    Course.findOne({ slug: req.params.slug })
    .then(course => res.render('courses/show', {course: mongooseToObject(course)}))
    .catch(next);
  }

  create(req, res, next) {
    res.render('courses/create')
  }

  edit(req, res, next) {
    Course.findById(req.params.id)
    .then((course) => res.render('courses/edit', {course: mongooseToObject(course)}))
    .catch(next)
  }

  store(req, res, next) {
    const course = new Course(req.body)
    course.save()
    .then(() => res.redirect(`/`))
    .catch()
  }

  update(req, res, next) {
    Course.updateOne({_id: req.params.id}, req.body)
    .then(() => res.redirect('/me/stored/courses'))
    .catch(next)
  }
  destroy(req, res, next) {
    Course.delete({_id: req.params.id})
    .then(() => res.redirect('back'))
    .catch(next)
  }

  //[DELETE] /courses/:id/force
  forceDestroy(req, res, next){
    Course.deleteOne({_id: req.params.id})
    .then(() => res.redirect('back'))
    .catch(next)
  }

  destroy(req, res, next) {
    Course.delete({_id: req.params.id})
    .then(() => res.redirect('back'))
    .catch(next)
  }

  restore(req, res, next) {
    Course.restore({_id: req.params.id})
    .then(() => res.redirect('back'))
    .catch(next)
  }
}
module.exports = new CourseController();
