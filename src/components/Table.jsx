import useToken from "@/contexts/useToken";

const Table = ({ dates, subjects, students, data, admin }) => {
    const [token, setToken] = useToken();

    const rows = admin ? students : subjects;

    function createAttendance() {
        fetch('/api/createattendance', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token })
        });
    }

    return (
        <div className="grid grid-cols-6 border border-gray-400">
            {/* Left */}
            <div className="flex flex-col border-r border-r-gray-400">
                <div className="flex items-center justify-center h-10 border-b border-gray-400"></div>
                {
                    rows.map((row, index) => (
                        <div key={index} className="flex items-center justify-center h-10 border-b-gray-700 border-b">{row.subject}</div>
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
                    <div className="w-32 h-full flex justify-center items-center border-r border-gray-700">
                        <button className="w-8 h-8 rounded text-lg bg-slate-600/75 hover:w-28 hover:h-9 hover:text-2xl transition-all" onClick={createAttendance}>+</button>
                    </div>
                </div>
                {
                    rows.map((row, index) => (
                        <div key={index} className="w-max flex justify-center items-center border-r border-gray-700">
                            {
                                dates.map((date, index) => (
                                    <div key={index} className="w-32 h-10 flex justify-center items-center border-r border-b border-gray-700">
                                        {
                                            admin ?
                                            <input type="checkbox" defaultChecked={data[row][date] ? true : false} onChange={async () => {
                                                const res = await fetch('/api/attendance/admin', {
                                                    method: 'POST',
                                                    headers: { 'Content-Type': 'application/json' },
                                                    body: JSON.stringify({ token, row, date })
                                                });
                                                const data = await res.json();
                                                console.log(data);
                                            }} className="h-7 aspect-square" /> :
                                            <input type="checkbox" checked={data[row][date] ? true : false} readOnly className="h-7 aspect-square" />
                                        }
                                    </div>
                                ))
                            }
                        </div>
                    ))
                }
            </div>        
        </div>
    );
}

Table.defaultProps = {
    admin: false,
    data: {}
};

export default Table;