import { createBrowserRouter } from "react-router";
import { ClienteLayout } from "../layouts/ClienteLayout";
import { Nails } from "../client/catalogo/pages/Nails";
import { Eyes } from "../client/catalogo/pages/Eyes";
import { Hair } from "../client/catalogo/pages/Hair";
import { Inicio } from "../home/page/Inicio";
import { AgendarCita } from "../client/formularios/pages/Agendar";
import { CitaConfirmada } from "../client/formularios/pages/Confirmacion";
import { adminRouteBranch } from "./admin.router";

export const rootRouter = createBrowserRouter([
    {
        path: '/',
        element: <ClienteLayout/>,
        children: [
            {
                index: true,
                element: <Inicio/>
            },
            {
                path: '/catalogo/3',
                element: <Eyes/>
            },
            {
                path: '/catalogo/1',
                element: <Hair/>
            },
            {
                path: '/catalogo/2',
                element: <Nails/>
            },
            {
                path: '/agendar',
                element: <AgendarCita/>
            },
            {
                path: '/agendar/confirmacion',
                element: <CitaConfirmada/>
            }
        ]
    },
    adminRouteBranch,
]);