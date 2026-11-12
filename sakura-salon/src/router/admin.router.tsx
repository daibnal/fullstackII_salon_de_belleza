import { AdminLayout } from "../layouts/AdminLayout";
import { Dashboard } from "../admin/home/Dashboard";
import { Agenda } from "../admin/pages/Agenda";
import { Servicios } from "../admin/pages/Servicios";
import { Personal } from "../admin/pages/Personal";
import { Insumos } from "../admin/pages/Insumos";
import { Reportes } from "../admin/pages/Reportes";

export const adminRouteBranch = {
	path: "/admin",
	element: <AdminLayout />,
	children: [
		{
			index: true,
			element: <Dashboard />,
		},
		{
			path: "agenda",
			element: <Agenda />,
		},
		{
			path: "servicios",
			element: <Servicios />,
		},
		{
			path: "personal",
			element: <Personal />,
		},
		{
			path: "insumos",
			element: <Insumos />,
		},
		{
			path: "reportes",
			element: <Reportes />,
		},
	],
};
