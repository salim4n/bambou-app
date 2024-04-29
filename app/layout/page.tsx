"use client";

import { generateMenuItem } from "@/lib/menuItem";
import { Menu } from "antd";
import * as ui from "@tensorflow/tfjs-vis";


export default function Layout({children}: Readonly<{children: React.ReactNode;}>){
    const date = new Date();
    const visor = ui.visor();

    return (
        
        <><header className="fixed top-0 w-full z-50 bg-slate-600">
            <Menu mode="horizontal" theme="dark" items={generateMenuItem()} />
        </header><main className="container mx-auto mt-20 mb-20 px-4">
                {children}
            </main><footer className="fixed bottom-0 w-full z-50 bg-slate-600">
                <p className="text-center m-3 p-3 text-white">&copy;{date.getFullYear()} - Salim4n -  Data Playground</p>
            </footer></>

    )
}