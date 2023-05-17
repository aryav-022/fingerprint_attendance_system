import useToken from "@/contexts/useToken";
import jwt from 'jsonwebtoken';
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Table from "@/components/Table";
import User from "../../models/User";
import Admin from "../../models/Admin";
import Attendance from "../../models/Attendance";
import mongoose from "mongoose";

const Home = ({ logged, name, email, admin, subjects, students, subject, data, dates }) => {
  const [token, setToken] = useToken();
  const codeRef = useRef();
  const subRef = useRef();
  const [makeAdminMessage, setMakeAdminMessage] = useState("");

  const joinClass = async () => {
    const code = codeRef.current.value;

    const res = await fetch('/api/join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, email, name })
    });
    const data = await res.json();
    setMakeAdminMessage(data.message);
    setTimeout(() => {
      setMakeAdminMessage("");
    }, 4000);
  }

  const makeAdmin = async () => {
    const code = codeRef.current.value;
    const adminSubject = subRef.current.value;

    const res = await fetch('/api/makeadmin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, code, subject: adminSubject })
    });
    const data = await res.json();
    setMakeAdminMessage(data.message);
    setTimeout(() => {
      setMakeAdminMessage("");
    }, 4000);
    codeRef.current.value = "";
    subRef.current.value = "";
  }

  if (logged) {
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
              <h3 className="col-span-3 text-lg w-full">{subject}</h3>
            </div>
          }
        </div>
        {
          admin ?
            <>
              <h1 className="text-3xl mt-12">Make Admin</h1>
              <div className="mt-4 flex gap-4 items-center">
                <input type="email" className="px-3 py-2 rounded-lg" placeholder="Enter Email" required ref={codeRef} />
                <input type="text" className="px-3 py-2 rounded-lg" placeholder="Enter Subject" required ref={subRef} />
                <button onClick={makeAdmin} className="bg-slate-600 px-4 py-2 rounded-lg hover:bg-slate-700">Make Admin</button>
              </div>
              <p className="mt-1 text-green-200">{makeAdminMessage}</p>
            </> :
            <>
              <h1 className="text-3xl mt-12">Join Class</h1>
              <div className="mt-4 flex items-center">
                <input type="email" className="px-3 py-2 rounded-l-lg" placeholder="Enter Class Code" required ref={codeRef} />
                <button onClick={joinClass} className="bg-slate-600 px-4 py-2 rounded-r-lg hover:bg-slate-700">Join</button>
              </div>
              <p className="mt-1 text-green-200">{makeAdminMessage}</p>
            </>
        }
        <div className="my-12">
          <h1 className="text-3xl mb-4">Attendance</h1>
          <Table dates={dates} subjects={subjects === 'null' && JSON.parse(subjects)} students={students} data={data} admin={admin} />
        </div>
      </section>
    );
  }
  else {
    useEffect(() => {
      if (token !== null && token !== undefined) {
        setToken(null);
      }
    }, []);

    return (
      <section className="text-white">
        <div className="mx-auto max-w-screen-xl px-4 py-32 lg:flex lg:h-screen lg:items-center">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text text-3xl font-extrabold text-transparent sm:text-5xl">
              ATTENDANCE SYSTEM
            </h1>
          </div>
        </div>
      </section>
    )
  }
}

export async function getServerSideProps({ req }) {
  const { token } = req.cookies;

  if (!token || token === "null" || token === "undefined") {
    return {
      props: {
        logged: false
      }
    }
  }

  const data = {};
  const dates = new Set();

  try {
    const { email, name, admin } = jwt.verify(token, process.env.JWT_SECRET);

    if (admin) {
      await mongoose.connect(process.env.DB_URL, {
        useUnifiedTopology: true,
        useNewUrlParser: true
      });

      const adminUser = await Admin.findOne({ email });

      if (!adminUser) {
        return {
          props: {
            logged: false
          }
        }
      }

      const subject = adminUser.subject;
      const students = adminUser.students;
      
      const attendance = await Attendance.find({ subject: adminUser.subject });

      attendance.forEach((att) => {
        const date = att.date;
        dates.add(date);
        const studentsPresent = att.students;

        studentsPresent.forEach((student) => {
          data[student][date] = true;
        });

        students.forEach(student => {
          if (!data[student][date]) data[student][date] = false;
        })
      });

      return {
        props: {
          logged: true,
          email,
          name,
          admin,
          subject,
          students,
          data,
          dates: [...dates].sort()
        }
      }
    }
    else {
      const user = await User.findOne({ email });

      if (!user) {
        return {
          props: {
            logged: false
          }
        }
      }

      const subjects = JSON.stringify(user.subjects);

      console.log(subjects);

      const attendance = await Attendance.find();

      attendance.forEach((att) => {
        const date = att.date;
        const studentsPresent = att.students;

        if (att.subject in subjects) {
          dates.add(date);
        }

        if (studentsPresent.includes(email)) {
          data[att.subject][date] = true;
        }
      });

      return {
        props: {
          logged: true,
          email,
          name,
          admin,
          subjects,
          data,
          dates: [...dates].sort()
        }
      }
    }
  }
  catch (err) {
    console.log(err);
    return {
      props: {
        logged: false
      }
    }
  }
}


export default Home;