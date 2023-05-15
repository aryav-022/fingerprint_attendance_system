import Image from "next/image";
import Members from "@/data/Members.json"

const About = () => {
  function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
  }

  return (
    <div className="py-16 px-12">
      <section className="mx-10 mt-16 w-3/5">
        <h1 className="text-4xl font-bold">About</h1>
        <p className="mt-4 text-lg">The Electronic Biometric Attendance System is a modern solution that revolutionizes attendance tracking in educational institutions, workplaces, and organizations. By utilizing unique biometric characteristics like fingerprints or facial features, it offers accurate and secure identification. This automated system eliminates proxy attendance, reduces errors, and saves time. It enhances security, integrates easily with existing systems, and provides reliable attendance data. The Electronic Biometric Attendance System is a streamlined and efficient approach to attendance management.</p>
      </section>
      <section className="mx-10 mt-16">
        <h1 className="text-4xl font-bold">Team</h1>
        <ul className="flex justify-between mt-10 w-full">
          {
            Members.map((member, index) => (
              <li key={index}>
                <a href={member.link} target="_blank" rel="noopener noreferrer" className={`relative group h-60 w-60 block overflow-hidden rounded-lg hover:scale-110 transition-all`}>
                  <div className="p-4 text-lg text-center flex items-center justify-center absolute z-10 w-full h-full bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity">{member.content}</div>
                  <Image src={member.img} alt={member.name} width={240} height={240} />
                </a>
                <div className="w-full mt-2 text-2xl flex justify-between">
                  <h2>{member.name}</h2>
                  <h2>{member.emoji}</h2>
                </div>
              </li>
            ))
          }
        </ul>
      </section>
    </div>
  );
}

export default About;