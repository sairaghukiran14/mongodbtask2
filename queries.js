// Design database for Zen class programme
// users
// codekata
// attendance
// topics
// tasks
// company_drives
// mentors


use zenclassprogramme

db.createCollection("users")

db.users.insertOne({
  user_name: "John Doe",
  user_email: "johndoe@example.com",
  user_password: "password123",
  user_role: "student"
})

db.createCollection("codekata")

db.codekata.insertOne({
  title: "Palindrome Check",
  description: "Write a function to check if a string is a palindrome.",
  difficulty: "Easy"
})

db.createCollection("attendance")

db.attendance.insertOne({
  userId: ObjectId("615c6f2b41c662a9d0fc9d21"),
  date: ISODate("2023-05-30"),
  present: true
})

db.createCollection("topics")

db.topics.insertOne({
  title: "Introduction to Algorithms",
  description: "An overview of algorithms and their importance in computer science."
})

db.createCollection("tasks")

db.tasks.insertOne({
  title: "Implement Binary Search",
  description: "Write a function to implement the binary search algorithm.",
  deadline: ISODate("2023-06-15")
})

db.createCollection("company_drives")

db.company_drives.insertOne({
  company: "ABC Corp",
  date: ISODate("2023-07-01"),
  location: "Virtual",
  description: "A recruitment drive conducted by ABC Corp."
})

db.createCollection("mentors")

db.mentors.insertOne({
  name: "Jane Smith",
  email: "janesmith@example.com",
  expertise: ["Web Development", "Database Management"]
})


// Find all the topics and tasks which are thought in the month of October
db.topics.aggregate([{$match: {createdAt: {$gte: ISODate("2023-10-01"),$lt: ISODate("2023-11-01")}}},{$lookup: {from: "tasks",localField: "_id",foreignField: "topicId",as: "tasks" }}])

// Find all the company drives which appeared between 15 oct-2020 and 31-oct-2020

db.company_drives.find({date: {$gte: ISODate("2020-10-15"),$lte: ISODate("2020-10-31")}})

// Find all the company drives and students who are appeared for the placement.

db.company_drives.aggregate([{$lookup: {from: "users",localField: "_id",foreignField: "companyId",as: "students"}}])


// Find the number of problems solved by the user in codekata

db.codekata.aggregate([{$match: {"user": "John Doe" }},{$group: {_id: "$user",totalProblemsSolved: { $sum: 1 }}}])

// Find all the mentors with who has the mentee's count more than 15

db.mentors.aggregate([{$lookup: {from: "mentees",localField: "_id",foreignField: "mentorId",as: "mentees"}},{$match: {$expr: { $gt: [{ $size: "$mentees" }, 15] }}  }])

// Find the number of users who are absent and task is not submitted  between 15 oct-2020 and 31-oct-2020

db.users.aggregate([
  {
    $lookup: {from: "attendance",localField: "_id",foreignField: "userId",as: "attendance" }
  },
  {
    $lookup: {from: "tasks",localField: "_id",foreignField: "assignedTo",as: "tasks"}
  },
  {
    $match: {
      $and: [
        {"attendance.date": {$gte: ISODate("2020-10-15"),$lte: ISODate("2020-10-31")}},{"attendance.present": false},{"tasks.submitted": false}]}},
  {
    $group: {_id: null,count: { $sum: 1 }}
}])
