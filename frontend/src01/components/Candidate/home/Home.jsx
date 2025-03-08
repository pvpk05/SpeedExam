import { Outlet } from "react-router-dom";
import Sidebar from "../sidebar/Sidebar";
import Header from "../header/Header";

function Home() {
    return (
        <div>
            <Header />
            <div className="container-fluid">
                <div className="row">
                    <div className="col-lg-2">
                        <Sidebar />
                    </div>
                    <div className="col-lg-10">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Home;