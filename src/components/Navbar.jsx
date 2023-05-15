import Link from "next/link";
import { useRouter } from "next/router";
import useToken from "@/contexts/useToken";

export default function Navbar() {
    const router = useRouter();
    const { pathname } = router;

    function activeLink(path) {
        if (path === pathname) return "relative py-1 text-lg before:content-[''] before:absolute before:block before:w-full before:h-[2px] before:bottom-0 before:left-0 before:bg-white before:scale-x-100 before:transition-transform hover:before:scale-x-100";
        return "relative py-1 text-lg before:content-[''] before:absolute before:block before:w-full before:h-[2px] before:bottom-0 before:left-0 before:bg-white before:scale-x-0 before:transition-transform hover:before:scale-x-100";
    };

    const [token, setToken] = useToken();

    function logout() {
        setToken(null);
        router.push('/auth/login');
    }

    return (
        <nav className="px-12 py-3 grid grid-cols-3 fixed top-0 left-0 w-full bg-black shadow shadow-neutral-700">
            <div className="flex items-center">
                <span className="text-4xl">☑️&nbsp;</span>
                <span className="text-2xl">Attendance System</span>
            </div>
            <ul className="m-auto">
                <li className="inline-block ml-12">
                    <Link href="/" className={activeLink('/')}>Home</Link>
                </li>
                <li className="inline-block ml-12">
                    <Link href="/about" className={activeLink('/about')}>About</Link>
                </li>
            </ul>
            {
                !token ? (
                    pathname === "/auth/login" ? (
                        <Link href="/auth/register" className="px-8 py-2 ml-auto bg-slate-600 rounded hover:bg-slate-700">Register</Link>
                    ) : (
                        <Link href="/auth/login" className="px-8 py-2 ml-auto bg-slate-600 rounded hover:bg-slate-700">Login</Link>
                    )
                ) : (
                    <button onClick={logout} className="px-8 py-2 ml-auto bg-slate-600 rounded hover:bg-slate-700">Logout</button>
                )
            }
        </nav>
    )
}

