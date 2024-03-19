CREATE TABLE Student
(StudentID NUMBER(8) PRIMARY KEY,
 StudentName VARCHAR(50) NOT NULL, 
 StudentSurname VARCHAR(50) NOT NULL,
 StudentAge INTEGER NOT NULL
);

CREATE TABLE Course
(CourseID VARCHAR(6) PRIMARY KEY,
 CourseName VARCHAR(100) NOT NULL,
CourseCredits INTEGER NOT NULL
);

CREATE TABLE CourseEnrolment
(StudentID NUMBER(8),
FOREIGN KEY(StudentID) REFERENCES Student(StudentID),
CourseID VARCHAR(6),
FOREIGN KEY(CourseID) REFERENCES Course(CourseID),
Semester INTEGER NOT NULL,
TotalCredits INTEGER NOT NULL CHECK(TotalCredits BETWEEN 15 AND 17)
);

CREATE TABLE Instructor
(InstructorID NUMBER(8) PRIMARY KEY,
 InstructorName VARCHAR(50) NOT NULL, 
 InstructorSurname VARCHAR(50) NOT NULL
 );

CREATE TABLE InstructorTeaches
(InstructorID NUMBER(8),
FOREIGN KEY(InstructorID) REFERENCES Instructor(InstructorID),
CourseID VARCHAR(6),
FOREIGN KEY(CourseID) REFERENCES Course(CourseID)
);

ALTER TABLE Course
ADD TotalStudents INTEGER NOT NULL CHECK(TotalStudents BETWEEN 0 AND 200);



