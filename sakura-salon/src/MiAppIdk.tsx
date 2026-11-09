import { RouterProvider } from "react-router";
import { rootRouter } from "./router/cliente.router";

export function MiAppIdk() {
    return (
        <RouterProvider router={rootRouter}/>
    );
};