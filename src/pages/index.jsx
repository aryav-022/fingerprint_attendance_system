import useToken from "@/contexts/useToken";
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { useRef } from "react";
import Link from "next/link";

const Home = ({ subjects, students, attendance, dates, admin, logged, name, email }) => {
  const [token, setToken] = useToken();
  const codeRef = useRef();

  function joinClass() {
    const code = codeRef.current.value;

    fetch('/api/join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, email, name })
    }).then(res => res.json()).then(data => {
      location.reload();
    });
  }

  if (logged) {
    const subjectKeys = admin ? students : Object.keys(subjects);

    return (
      <section className="mt-24 mx-16">
        {/* Personal Details */}
        <div>
          <h1 className="text-3xl mb-4">Personal Info</h1>
          <div className="grid grid-cols-5 mb-1 w-96">
            <h3 className="col-span-2 text-lg font-bold w-full">Name</h3>
            <h3 className="col-span-3 text-lg w-full">{name}</h3>
          </div>
          <div className="grid grid-cols-5 mb-1 w-96">
            <h3 className="col-span-2 text-lg font-bold w-full">Email</h3>
            <h3 className="col-span-3 text-lg w-full">{email}</h3>
          </div>
          {
            admin &&
            <div className="grid grid-cols-5 mb-1 w-96">
              <h3 className="col-span-2 text-lg font-bold w-full">Subject</h3>
              <h3 className="col-span-3 text-lg w-full">{subjects}</h3>
            </div>
          }
        </div>
        {
          !admin && 
          <>
            <h1 className="text-3xl mt-12">Join Class</h1>
            <div className="mt-4 flex items-center">
              <input type="email" className="px-3 py-2 rounded-l-lg" placeholder="Enter Class Code" required ref={codeRef} />
              <button onClick={joinClass} className="bg-slate-600 px-4 py-2 rounded-r-lg hover:bg-slate-700">Join</button>
            </div>
          </>
        }
        <div className="my-12">
          <h1 className="text-3xl mb-4">Attendance</h1>
          <div className="grid grid-cols-6 border border-gray-400">
            {/* Left */}
            <div className="border-r border-gray-400 flex flex-col">
              <div className="h-10 border-b border-gray-400"></div>
              {
                subjectKeys.map((subject, index) => (
                  <div key={index} className="flex items-center justify-center h-10 border-gray-700 border-b">{admin ? subject[0]: subject}</div>
                ))
              }
            </div>
            {/* Right */}
            <div className="col-span-5 overflow-x-auto">
              <div className="h-10 border-b border-gray-400 flex justify-start items-center w-max">
                {
                  dates.map((date, index) => (
                    <div key={index} className="w-32 h-full flex justify-center items-center border-r border-gray-700">{date}</div>
                  ))
                }
              </div>
              {
                subjectKeys.map((subject, index) => (
                  <div key={index} className="flex items-center justify-center h-10 w-max border-gray-700 border-b">
                    {
                      dates.map((date, index) => (
                        <div key={index} className="w-32 h-full flex justify-center items-center border-r border-gray-700">
                          {
                            admin ? 
                            <input type="checkbox" onChange={() => {
                              fetch("/api/attendance/admin", {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({token, date, student: subject[1]})
                              });
                            }} defaultChecked={
                              attendance[subject[1]][date.replaceAll("/", "-")] ? true : false
                            } className="h-7 aspect-square" /> : 
                            <input type="checkbox" checked={subjects[subject][date.replaceAll("/", "-")] ? true : false} readOnly className="h-7 aspect-square" />
                          }
                        </div>
                      ))
                    }
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </section>
    );
  } else {
    return (
      <section className="text-white">
        <div
          className="mx-auto max-w-screen-xl px-4 py-32 lg:flex lg:h-screen lg:items-center"
        >
          <div className="mx-auto max-w-3xl text-center">
            <h1
              className="bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text text-3xl font-extrabold text-transparent sm:text-5xl"
            >
              ATTENDANCE SYSTEM

              <span className="sm:block">NSUT</span>
            </h1>

            <p className="mx-auto mt-4 max-w-xl sm:text-xl/relaxed">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nesciunt illo
              tenetur fuga ducimus numquam ea!
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                className="block w-full rounded border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-white focus:outline-none focus:ring active:text-opacity-75 sm:w-auto"
                href="/auth/register"
              >
                Register
              </Link>

              <Link
                className="block w-full rounded border border-blue-600 px-12 py-3 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring active:bg-blue-500 sm:w-auto"
                href="/about"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>
    )
  }
}

export async function getServerSideProps({ req }) {
  const { token } = req.cookies;

  if (!token || token === 'null' || token === 'undefined' || jwt.verify(token, process.env.JWT_SECRET) === false) {
    return {
      props: {
        logged: false,
        subjects: null,
        students: null,
        attendance: null,
        dates: null,
        admin: false,
        name: null,
        email: null
      }
    }
  }

  const { name, email, admin } = jwt.decode(token);

  if (admin) {
    const Admins = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'src/data/Admins.json'), 'utf-8'));
    const firstElement = Admins[email][0];
    const students = Admins[email].slice(1);

    const startDate = new Date(firstElement[0]);
    const endDate = new Date(firstElement[1]);
    const subject = firstElement[2];
  
    const dates = [];
  
    for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
      dates.push((new Date(date)).toLocaleDateString('en-GB'));
    }

    const Attendance = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'src/data/Attendance.json'), 'utf-8'));

    const attendance = {};

    students.forEach(student => {
      attendance[student[1]] = Attendance[student[1]].subjects[subject];
    });

    return {
      props: {
        logged: true,
        students,
        subjects: subject,
        attendance,
        dates,
        admin: true,
        name,
        email
      }
    }
  }
  else {
    const Attendance = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'src/data/Attendance.json'), 'utf-8'));
    
    const student = Attendance[email];
    const subjects = student.subjects;
  
    const startDate = new Date(student.from);
    const endDate = new Date(student.to);
  
    const dates = [];
  
    for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
      dates.push((new Date(date)).toLocaleDateString('en-GB'));
    }
  
    return {
      props: {
        logged: true,
        subjects,
        students: null,
        attendance: null,
        dates: dates,
        admin: false,
        name,
        email
      }
    }
  }

}



export default Home;