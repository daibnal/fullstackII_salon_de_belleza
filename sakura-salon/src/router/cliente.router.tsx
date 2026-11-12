import { createBrowserRouter } from "react-router";
import { ClienteLayout } from "../layouts/ClienteLayout";
import { Nails } from "../client/catalogo/pages/Nails";
import { Eyes } from "../client/catalogo/pages/Eyes";
import { Hair } from "../client/catalogo/pages/Hair";
import { Inicio } from "../home/page/Inicio";
import { AgendarCita } from "../client/formularios/pages/Agendar";
import { CitaConfirmada } from "../client/formularios/pages/Confirmacion";

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
                path: '/catalogo/eyes',
                element: <Eyes/>
            },
            {
                path: '/catalogo/hair',
                element: <Hair/>
            },
            {
                path: '/catalogo/nails',
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
    }
]);