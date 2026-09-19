"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  Bell, BookOpen, CalendarDays, Check, ChevronRight, ClipboardCheck, Clock3,
  Eye, EyeOff, FileText, FolderOpen, GraduationCap, Home, LockKeyhole, LogOut,
  Mail, Menu, Plus, Search, Settings, Shield, ShieldCheck, Upload, User, UserCog, Users, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type Role = "educativa" | "estudiante" | "admin";
type Status = "Pendiente" | "Aprobada" | "Requiere cambios" | "Rechazada";
type Excuse = { id: number; student: string; course: string; date: string; reason: string; detail: string; status: Status };
type Permission = "Crear excusas" | "Revisar excusas" | "Aprobar o rechazar" | "Ver reportes" | "Gestionar usuarios";
type UserRecord = { id: number; name: string; email: string; recovery: string; role: "Estudiante" | "Área educativa" | "Administrador"; permissions: Permission[]; active: boolean };

const initialExcuses: Excuse[] = [
  { id: 1, student: "María José Sánchez", course: "8°A", date: "12 sep 2026", reason: "Cita médica", detail: "Control pediátrico", status: "Pendiente" },
  { id: 2, student: "Juan Pablo Rodríguez", course: "9°B", date: "11 sep 2026", reason: "Incapacidad médica", detail: "Incapacidad por 3 días", status: "Aprobada" },
  { id: 3, student: "Laura Gabriela Torres", course: "10°A", date: "10 sep 2026", reason: "Asunto familiar", detail: "Compromiso familiar", status: "Rechazada" },
];

const initialUsers: UserRecord[] = [
  { id: 1, name: "Carlos Rodríguez", email: "admin@iedlavictoria.edu.co", recovery: "carlos.rodriguez@gmail.com", role: "Administrador", permissions: ["Crear excusas", "Revisar excusas", "Aprobar o rechazar", "Ver reportes", "Gestionar usuarios"], active: true },
  { id: 2, name: "Andrea Torres", email: "andrea.torres@iedlavictoria.edu.co", recovery: "atorres.personal@gmail.com", role: "Área educativa", permissions: ["Revisar excusas", "Aprobar o rechazar", "Ver reportes"], active: true },
  { id: 3, name: "María José Sánchez", email: "maria.sanchez@iedlavictoria.edu.co", recovery: "acudiente.maria@gmail.com", role: "Estudiante", permissions: ["Crear excusas"], active: true },
  { id: 4, name: "Juan Pablo Rodríguez", email: "juan.rodriguez@iedlavictoria.edu.co", recovery: "familia.rodriguez@gmail.com", role: "Estudiante", permissions: ["Crear excusas"], active: true },
];

const menuByRole = {
  educativa: [["Inicio", Home], ["Excusas", FileText], ["Estudiantes", Users], ["Reportes", ClipboardCheck], ["Configuración", Settings]],
  estudiante: [["Inicio", Home], ["Nueva excusa", Plus], ["Mis excusas", FileText], ["Documentos", FolderOpen], ["Mi perfil", User]],
  admin: [["Panel general", Home], ["Solicitudes", FileText], ["Usuarios y roles", UserCog], ["Permisos", ShieldCheck], ["Configuración", Settings]],
} as const;

function Logo() {
  return <div className="brand"><img src="/escudo-la-victoria.png" alt="Escudo de la I.E.D. La Victoria" /><div><strong>Aula Control</strong><span>Sistema de gestión de excusas</span></div></div>;
}

function Login({ onLogin }: { onLogin: (role: Role) => void }) {
  const [role, setRole] = useState<Role>("educativa");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("coordinacion@iedlavictoria.edu.co");
  const [password, setPassword] = useState("AulaControl2026");
  const [error, setError] = useState("");
  const [recoveryOpen, setRecoveryOpen] = useState(false);
  const [recoveryResult, setRecoveryResult] = useState("");
  const isAdmin = role === "admin";
  function submit(event: FormEvent) {
    event.preventDefault();
    if (!email.includes("@") || password.length < 6) return setError("Revisa el correo institucional y la contraseña.");
    onLogin(role);
  }
  return <main className="login-screen">
    <div className="ambient ambient-one" /><div className="ambient ambient-two" />
    <header className="login-heading"><span /><h1>Una comunidad que acompaña <em>tus metas</em></h1></header>
    <form className="login-card glass-card" onSubmit={submit}>
      <Logo /><div className="rule" /><h2>{isAdmin ? "Acceso administrativo" : "¿Cómo deseas ingresar?"}</h2>
      {isAdmin ? <div className="admin-login-note"><ShieldCheck /><div><b>Panel protegido</b><span>Gestión de usuarios, roles y permisos.</span></div><button type="button" onClick={() => { setRole("educativa"); setEmail("coordinacion@iedlavictoria.edu.co"); }}>Volver</button></div> : <div className="role-switch" aria-label="Selecciona tu tipo de usuario">
        <button type="button" className={role === "educativa" ? "active" : ""} onClick={() => setRole("educativa")}><GraduationCap /> Área educativa</button>
        <button type="button" className={role === "estudiante" ? "active" : ""} onClick={() => setRole("estudiante")}><User /> Estudiante</button>
      </div>}
      <label htmlFor="email">Correo institucional</label>
      <div className="input-shell"><Mail /><Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
      <label htmlFor="password">Contraseña</label>
      <div className="input-shell"><LockKeyhole /><Input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} /><button className="eye" type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}>{showPassword ? <EyeOff /> : <Eye />}</button></div>
      <button type="button" className="forgot" onClick={() => { setRecoveryOpen(true); setRecoveryResult(""); }}>¿Olvidaste tu contraseña?</button>
      {error && <p className="form-error">{error}</p>}
      <Button className="primary-float" type="submit">Iniciar sesión <ChevronRight /></Button>
      <p className="secure"><ShieldCheck /> Acceso seguro y protegido</p><button type="button" className="help-link">¿Necesitas ayuda?</button>
      {!isAdmin && <button type="button" className="admin-entry" aria-label="Acceso administrativo" onClick={() => { setRole("admin"); setEmail("admin@iedlavictoria.edu.co"); }}><Shield /> Administración</button>}
    </form>
    <footer className="institution">I.E.D. La Victoria</footer>
    <Dialog open={recoveryOpen} onOpenChange={setRecoveryOpen}><DialogContent className="dialog-card"><DialogHeader><DialogTitle>Recuperar contraseña</DialogTitle><DialogDescription>Escribe tu correo institucional para consultar el destino registrado.</DialogDescription></DialogHeader><div className="dialog-form"><label>Correo institucional</label><Input value={email} onChange={(e) => setEmail(e.target.value)} />{recoveryResult && <div className="recovery-result"><Mail /><p><b>Enlace de recuperación preparado</b><span>{recoveryResult}</span></p></div>}</div><DialogFooter><Button variant="outline" onClick={() => setRecoveryOpen(false)}>Cancelar</Button><Button className="primary-float compact" onClick={() => { const found = initialUsers.find((user) => user.email.toLowerCase() === email.toLowerCase()); const destination = found?.recovery || "el correo personal registrado por el usuario"; const [name, domain] = destination.split("@"); const masked = domain ? `${name.slice(0, 2)}•••@${domain}` : destination; setRecoveryResult(`Se enviará a ${masked}`); }}>Continuar</Button></DialogFooter></DialogContent></Dialog>
  </main>;
}

function Sidebar({ role, active, setActive, logout }: { role: Role; active: string; setActive: (value: string) => void; logout: () => void }) {
  const [open, setOpen] = useState(false);
  return <><button className="mobile-menu" onClick={() => setOpen(!open)} aria-label="Abrir menú"><Menu /></button><aside className={`sidebar glass-card ${open ? "open" : ""}`}>
    <Logo /><nav>{menuByRole[role].map(([label, Icon]) => <button key={label} className={active === label ? "active" : ""} onClick={() => { setActive(label); setOpen(false); }}><Icon /><span>{label}</span></button>)}</nav>
    <p className="sidebar-motto">Humanismo<br />y Excelencia<br />siempre</p><button className="logout" onClick={logout}><LogOut /> Cerrar sesión</button>
  </aside></>;
}

function Header({ role }: { role: Role }) {
  const copy = role === "admin" ? ["Panel de administración", "Controla usuarios, permisos y actividad del sistema"] : role === "educativa" ? ["Buenos días, Coordinación", "Aquí tienes el resumen de las excusas escolares"] : ["Hola, María José", "Gestiona y consulta tus excusas escolares"];
  const profile = role === "admin" ? "Admin · Carlos Rodríguez" : role === "educativa" ? "Área educativa · Andrea Torres" : "Estudiante · María José";
  return <header className="topbar"><div><h1>{copy[0]}</h1><p>{copy[1]}</p></div><div className="top-actions"><div className="search"><Search /><input aria-label="Buscar" placeholder="Buscar" /></div><button className="circle-button" aria-label="Notificaciones"><Bell /><i /></button><button className="profile-pill"><span><User /></span>{profile}</button></div></header>;
}

function StatCard({ icon: Icon, label, value, tone, text }: { icon: typeof Clock3; label: string; value: number; tone: string; text: string }) {
  return <article className={`stat-card glass-card ${tone}`}><span className="stat-icon"><Icon /></span><div><b>{label}</b><strong>{value}</strong><small>{text}</small></div></article>;
}

function StatusBadge({ status }: { status: Status }) {
  const cls = status.toLowerCase().replace(" ", "-");
  return <Badge className={`status ${cls}`}>{status === "Aprobada" ? <Check /> : status === "Pendiente" ? <Clock3 /> : <X />}{status}</Badge>;
}

function CalendarCard() {
  const days = Array.from({ length: 30 }, (_, index) => index + 1);
  return <article className="calendar-card glass-card"><h3><CalendarDays /> Próximas fechas</h3><div className="calendar-head"><button>‹</button><b>Septiembre 2026</b><button>›</button></div><div className="weekdays">{["D", "L", "M", "M", "J", "V", "S"].map((day, i) => <span key={`${day}-${i}`}>{day}</span>)}</div><div className="calendar-grid">{days.map((day) => <button key={day} className={day === 12 ? "today" : day === 18 ? "marked" : ""}>{day}</button>)}</div></article>;
}

function ActivityCard({ admin = false }: { admin?: boolean }) {
  const entries = admin ? [["Nueva excusa registrada", "Hace 15 minutos"], ["Excusa aprobada", "Hace 1 hora"], ["Documento actualizado", "Hace 2 horas"]] : [["Tu excusa está en revisión", "Cita médica · hace 2 horas"], ["Debes adjuntar un documento", "Incapacidad médica"], ["Tu excusa fue aprobada", "Asunto familiar"]];
  return <article className="activity-card glass-card"><div className="section-title"><h3>{admin ? "Actividad reciente" : "Notificaciones"}</h3><Bell /></div><div className="timeline">{entries.map(([title, meta], index) => <div key={title}><span className={`dot dot-${index}`} /><FileText /><p><b>{title}</b><small>{meta}</small></p></div>)}</div></article>;
}

function AdminDashboard({ excuses, onOpen, onNew }: { excuses: Excuse[]; onOpen: (item: Excuse) => void; onNew: () => void }) {
  return <><section className="stats-grid admin-stats"><StatCard icon={Clock3} label="Pendientes" value={excuses.filter((e) => e.status === "Pendiente").length + 9} tone="yellow" text="Por revisar" /><StatCard icon={Check} label="Aprobadas" value={38} tone="green" text="Este mes" /><StatCard icon={X} label="Rechazadas" value={4} tone="red" text="Este mes" /><StatCard icon={FileText} label="Total del mes" value={54} tone="blue" text="Todas las excusas" /></section>
    <section className="review-strip glass-card"><span><b>12</b> excusas pendientes por revisar</span><Button className="primary-float compact">Revisar ahora <ChevronRight /></Button></section>
    <section className="dashboard-grid"><article className="requests-card glass-card"><div className="section-title"><div><h2>Solicitudes recientes</h2><p>Últimas excusas registradas en el sistema</p></div><Button className="primary-float compact" onClick={onNew}><Plus /> Nueva excusa</Button></div><div className="table-wrap"><table><thead><tr><th>Estudiante</th><th>Curso</th><th>Fecha</th><th>Motivo</th><th>Estado</th><th>Acción</th></tr></thead><tbody>{excuses.map((item) => <tr key={item.id}><td><b>{item.student}</b><small>T.I. 1034876291</small></td><td>{item.course}</td><td>{item.date}</td><td><b>{item.reason}</b><small>{item.detail}</small></td><td><StatusBadge status={item.status} /></td><td><button className="detail-btn" onClick={() => onOpen(item)}>Ver detalle</button></td></tr>)}</tbody></table></div></article><aside className="right-column"><CalendarCard /><ActivityCard admin /></aside></section></>;
}

function StudentDashboard({ excuses, onOpen, onNew }: { excuses: Excuse[]; onOpen: (item: Excuse) => void; onNew: () => void }) {
  const myExcuses = excuses.filter((item) => item.student === "María José Sánchez");
  return <><section className="student-hero glass-card"><div><h2>¿Necesitas presentar una excusa?</h2><p>Registra tu solicitud y adjunta los documentos necesarios.</p><Button className="primary-float" onClick={onNew}><Plus /> Crear nueva excusa</Button></div><div className="upload-visual"><FileText /><span><Upload /></span></div></section>
    <section className="stats-grid student-stats"><StatCard icon={Clock3} label="En revisión" value={2} tone="yellow" text="Tus excusas están en revisión" /><StatCard icon={Check} label="Aprobadas" value={6} tone="green" text="Tus excusas han sido aprobadas" /><StatCard icon={X} label="Requieren cambios" value={1} tone="red" text="Debes completar información" /></section>
    <section className="dashboard-grid student-grid"><article className="requests-card glass-card"><div className="section-title"><div><h2>Mis excusas recientes</h2><p>Consulta el estado de tus solicitudes</p></div><button className="detail-btn">Ver todas mis excusas</button></div>{myExcuses.map((item) => <div className="student-request" key={item.id}><div><b>{item.reason}</b><span>{item.date} · Documento adjunto</span></div><StatusBadge status={item.status} /><button className="detail-btn" onClick={() => onOpen(item)}>Ver detalle</button></div>)}<div className="student-request"><div><b>Calamidad familiar</b><span>5 sep 2026 · Carta adjunta</span></div><StatusBadge status="Aprobada" /><button className="detail-btn">Ver detalle</button></div><div className="progress-card"><div className="progress-labels"><b>Enviada</b><b>En revisión</b><span>Respuesta</span></div><Progress value={66} /></div><div className="how-it-works"><h3>¿Cómo funciona?</h3><div><span><b>1</b>Registra</span><span><b>2</b>Adjunta</span><span><b>3</b>Consulta</span></div></div></article><aside className="right-column"><CalendarCard /><ActivityCard /></aside></section></>;
}

const trendData = [
  { month: "Abr", excusas: 21 }, { month: "May", excusas: 29 }, { month: "Jun", excusas: 25 },
  { month: "Jul", excusas: 34 }, { month: "Ago", excusas: 31 }, { month: "Sep", excusas: 54 },
];
const statusData = [{ name: "Aprobadas", value: 38, color: "#24b36b" }, { name: "Pendientes", value: 12, color: "#f6c515" }, { name: "Rechazadas", value: 4, color: "#ec6666" }];

function AdminOverview({ excuses, users, onOpen, onCreateUser }: { excuses: Excuse[]; users: UserRecord[]; onOpen: (item: Excuse) => void; onCreateUser: () => void }) {
  return <>
    <section className="stats-grid admin-overview-stats"><StatCard icon={FileText} label="Excusas del mes" value={54} tone="blue" text="12 requieren atención" /><StatCard icon={Users} label="Usuarios activos" value={users.filter((user) => user.active).length} tone="green" text="En todos los roles" /><StatCard icon={Clock3} label="Pendientes" value={12} tone="yellow" text="Por revisar" /><StatCard icon={ShieldCheck} label="Roles configurados" value={3} tone="red" text="Permisos actualizados" /></section>
    <section className="admin-chart-grid">
      <article className="chart-card glass-card"><div className="section-title"><div><h2>Tendencia de excusas</h2><p>Solicitudes registradas durante los últimos 6 meses</p></div><select aria-label="Periodo"><option>Últimos 6 meses</option><option>Año escolar</option></select></div><div className="chart-area"><ResponsiveContainer width="100%" height="100%"><LineChart data={trendData} margin={{ top: 12, right: 16, left: -20, bottom: 0 }}><CartesianGrid stroke="#dceef6" strokeDasharray="4 4" /><XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#66749b", fontSize: 12 }} /><YAxis axisLine={false} tickLine={false} tick={{ fill: "#66749b", fontSize: 12 }} /><Tooltip contentStyle={{ borderRadius: 14, border: "1px solid #d9edf6" }} /><Line type="monotone" dataKey="excusas" stroke="#38addc" strokeWidth={4} dot={{ r: 5, fill: "#58bfe8", strokeWidth: 3, stroke: "#fff" }} /></LineChart></ResponsiveContainer></div></article>
      <article className="chart-card glass-card"><div className="section-title"><div><h2>Estado actual</h2><p>Distribución de solicitudes</p></div></div><div className="pie-wrap"><ResponsiveContainer width="58%" height={210}><PieChart><Pie data={statusData} dataKey="value" innerRadius={48} outerRadius={76} paddingAngle={4}>{statusData.map((item) => <Cell key={item.name} fill={item.color} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer><div className="chart-legend">{statusData.map((item) => <span key={item.name}><i style={{ background: item.color }} /><b>{item.name}</b><small>{item.value}</small></span>)}</div></div></article>
    </section>
    <section className="requests-card glass-card admin-recent"><div className="section-title"><div><h2>Resumen general de excusas</h2><p>Consulta rápida de las últimas solicitudes</p></div><div className="admin-actions"><button className="filter-pill">Año 2026</button><button className="filter-pill">Todos los grados</button><Button className="primary-float compact" onClick={onCreateUser}><Plus /> Crear usuario</Button></div></div><div className="table-wrap"><table><thead><tr><th>Estudiante</th><th>Grado</th><th>Fecha</th><th>Tipo de excusa</th><th>Estado</th><th>Acción</th></tr></thead><tbody>{excuses.map((item) => <tr key={item.id}><td><b>{item.student}</b></td><td>{item.course}</td><td>{item.date}</td><td>{item.reason}</td><td><StatusBadge status={item.status} /></td><td><button className="detail-btn" onClick={() => onOpen(item)}>Ver detalle</button></td></tr>)}</tbody></table></div></section>
  </>;
}

function UsersManagement({ users, onCreate, onReset }: { users: UserRecord[]; onCreate: () => void; onReset: (user: UserRecord) => void }) {
  return <section className="management-card glass-card"><div className="section-title"><div><h2>Usuarios y roles</h2><p>Crea cuentas, asigna permisos y configura la recuperación de acceso.</p></div><Button className="primary-float compact" onClick={onCreate}><Plus /> Crear usuario</Button></div><div className="user-filters"><div className="search"><Search /><input placeholder="Buscar por nombre o correo" aria-label="Buscar usuario" /></div><button className="filter-pill">Todos los roles</button><button className="filter-pill">Usuarios activos</button></div><div className="table-wrap"><table className="users-table"><thead><tr><th>Nombre y usuario</th><th>Rol</th><th>Recuperación de contraseña</th><th>Permisos</th><th>Estado</th><th>Acción</th></tr></thead><tbody>{users.map((item) => <tr key={item.id}><td><div className="user-cell"><span>{item.name.split(" ").map((part) => part[0]).slice(0, 2).join("")}</span><div><b>{item.name}</b><small>{item.email}</small></div></div></td><td><Badge className="role-badge">{item.role}</Badge></td><td><b>{item.recovery}</b><small>Destino de recuperación</small></td><td><span className="permission-count">{item.permissions.length} permisos</span></td><td><span className="active-status"><i /> Activo</span></td><td><button className="detail-btn" onClick={() => onReset(item)}>Restablecer clave</button></td></tr>)}</tbody></table></div></section>;
}

function PermissionsPanel({ users }: { users: UserRecord[] }) {
  const roles = [
    { name: "Administrador", text: "Control total del sistema", color: "admin", permissions: ["Crear usuarios", "Asignar permisos", "Revisar y aprobar excusas", "Ver reportes"] },
    { name: "Área educativa", text: "Gestión académica de solicitudes", color: "teacher", permissions: ["Revisar excusas", "Aprobar o rechazar", "Consultar estudiantes", "Ver reportes"] },
    { name: "Estudiante", text: "Gestión de sus propias solicitudes", color: "student", permissions: ["Crear excusas", "Adjuntar documentos", "Consultar estados", "Actualizar su perfil"] },
  ];
  return <section className="permissions-view"><div className="permissions-heading"><div><h2>Permisos por rol</h2><p>Define qué acciones puede realizar cada tipo de usuario.</p></div><span>{users.length} usuarios registrados</span></div><div className="role-cards">{roles.map((role) => <article className={`role-card glass-card ${role.color}`} key={role.name}><div className="role-card-icon"><ShieldCheck /></div><h3>{role.name}</h3><p>{role.text}</p><ul>{role.permissions.map((permission) => <li key={permission}><Check />{permission}</li>)}</ul><button className="detail-btn">Editar permisos</button></article>)}</div></section>;
}

const allPermissions: Permission[] = ["Crear excusas", "Revisar excusas", "Aprobar o rechazar", "Ver reportes", "Gestionar usuarios"];

function CreateUserDialog({ open, onOpenChange, onSave }: { open: boolean; onOpenChange: (open: boolean) => void; onSave: (user: Omit<UserRecord, "id" | "active">) => void }) {
  const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [recovery, setRecovery] = useState(""); const [password, setPassword] = useState(""); const [role, setRole] = useState<UserRecord["role"]>("Estudiante"); const [permissions, setPermissions] = useState<Permission[]>(["Crear excusas"]); const [error, setError] = useState("");
  function chooseRole(nextRole: UserRecord["role"]) { setRole(nextRole); setPermissions(nextRole === "Administrador" ? allPermissions : nextRole === "Área educativa" ? ["Revisar excusas", "Aprobar o rechazar", "Ver reportes"] : ["Crear excusas"]); }
  function submit() { if (!name.trim() || !email.includes("@") || !recovery.includes("@") || password.length < 8) return setError("Completa los datos y usa una contraseña temporal de mínimo 8 caracteres."); onSave({ name: name.trim(), email: email.trim(), recovery: recovery.trim(), role, permissions }); setName(""); setEmail(""); setRecovery(""); setPassword(""); setError(""); }
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="dialog-card user-dialog"><DialogHeader><DialogTitle>Crear nuevo usuario</DialogTitle><DialogDescription>La contraseña será temporal. El usuario deberá cambiarla después de ingresar.</DialogDescription></DialogHeader><div className="dialog-form user-form"><label>Nombre completo</label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre y apellidos" /><label>Correo institucional</label><Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="usuario@iedlavictoria.edu.co" /><label>Correo de recuperación</label><Input value={recovery} onChange={(e) => setRecovery(e.target.value)} placeholder="Correo personal o del acudiente" /><label>Contraseña temporal</label><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mínimo 8 caracteres" /><label>Rol</label><select value={role} onChange={(e) => chooseRole(e.target.value as UserRecord["role"])}><option>Estudiante</option><option>Área educativa</option><option>Administrador</option></select><label>Permisos</label><div className="permission-options">{allPermissions.map((permission) => <label key={permission}><Checkbox checked={permissions.includes(permission)} onCheckedChange={(checked) => setPermissions((current) => checked ? [...current, permission] : current.filter((item) => item !== permission))} />{permission}</label>)}</div>{error && <p className="form-error">{error}</p>}</div><DialogFooter><Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button><Button className="primary-float compact" onClick={submit}>Crear usuario</Button></DialogFooter></DialogContent></Dialog>;
}

function NewExcuseDialog({ open, onOpenChange, onSave }: { open: boolean; onOpenChange: (open: boolean) => void; onSave: (reason: string, detail: string) => void }) {
  const [reason, setReason] = useState("Cita médica"); const [detail, setDetail] = useState("");
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="dialog-card"><DialogHeader><DialogTitle>Nueva excusa</DialogTitle><DialogDescription>Completa la información y adjunta el soporte si lo tienes.</DialogDescription></DialogHeader><div className="dialog-form"><label>Motivo</label><select value={reason} onChange={(e) => setReason(e.target.value)}><option>Cita médica</option><option>Incapacidad médica</option><option>Calamidad familiar</option><option>Otro motivo</option></select><label>Descripción</label><textarea placeholder="Cuéntanos brevemente qué ocurrió" value={detail} onChange={(e) => setDetail(e.target.value)} /><label className="upload-box"><Upload /><b>Adjuntar documento</b><span>PDF, JPG o PNG</span><input type="file" accept=".pdf,.jpg,.jpeg,.png" /></label></div><DialogFooter><Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button><Button className="primary-float compact" onClick={() => { onSave(reason, detail || "Solicitud registrada por el estudiante"); setDetail(""); }}>Enviar excusa</Button></DialogFooter></DialogContent></Dialog>;
}

function Dashboard({ role, logout }: { role: Role; logout: () => void }) {
  const [active, setActive] = useState(role === "admin" ? "Panel general" : "Inicio"); const [excuses, setExcuses] = useState(initialExcuses); const [users, setUsers] = useState(initialUsers); const [storageReady, setStorageReady] = useState(false); const [newOpen, setNewOpen] = useState(false); const [userOpen, setUserOpen] = useState(false); const [selected, setSelected] = useState<Excuse | null>(null); const [notice, setNotice] = useState(""); const view = useMemo(() => role, [role]);
  function saveExcuse(reason: string, detail: string) { setExcuses((current) => [{ id: Date.now(), student: "María José Sánchez", course: "8°A", date: "12 sep 2026", reason, detail, status: "Pendiente" }, ...current]); setNewOpen(false); setNotice("La excusa fue enviada correctamente."); setTimeout(() => setNotice(""), 3500); }
  function updateStatus(status: Status) { if (!selected) return; setExcuses((current) => current.map((item) => item.id === selected.id ? { ...item, status } : item)); setSelected(null); setNotice(`La excusa quedó como ${status.toLowerCase()}.`); setTimeout(() => setNotice(""), 3500); }
  function addUser(user: Omit<UserRecord, "id" | "active">) { setUsers((current) => [{ ...user, id: Date.now(), active: true }, ...current]); setUserOpen(false); setNotice(`El usuario ${user.name} fue creado correctamente.`); setTimeout(() => setNotice(""), 3500); }
  function resetPassword(user: UserRecord) { setNotice(`La recuperación de ${user.name} se enviará a ${user.recovery}.`); setTimeout(() => setNotice(""), 5000); }
  useEffect(() => { try { const saved = window.localStorage.getItem("aula-control-users"); if (saved) setUsers(JSON.parse(saved) as UserRecord[]); } catch {} finally { setStorageReady(true); } }, []);
  useEffect(() => { if (storageReady) window.localStorage.setItem("aula-control-users", JSON.stringify(users)); }, [storageReady, users]);
  useEffect(() => {
    const context = (document as unknown as { modelContext?: { registerTool?: (tool: object, options?: { signal: AbortSignal }) => void | Promise<void> } }).modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    void Promise.resolve(context.registerTool({
      name: "create_excuse",
      title: "Registrar una excusa",
      description: "Registra una nueva excusa escolar para el estudiante que tiene la sesión abierta.",
      inputSchema: { type: "object", properties: { reason: { type: "string" }, detail: { type: "string" } }, required: ["reason", "detail"], additionalProperties: false },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute(input: unknown) {
        const data = input as { reason?: unknown; detail?: unknown };
        if (typeof data.reason !== "string" || typeof data.detail !== "string" || !data.reason.trim() || !data.detail.trim()) throw new Error("El motivo y la descripción son obligatorios.");
        saveExcuse(data.reason.trim(), data.detail.trim());
        return { status: "created", reason: data.reason.trim() };
      },
    }, { signal: lifecycle.signal })).catch(() => undefined);
    return () => lifecycle.abort();
  }, []);
  let content;
  if (role === "admin") {
    content = active === "Panel general" ? <AdminOverview excuses={excuses} users={users} onOpen={setSelected} onCreateUser={() => setUserOpen(true)} /> : active === "Usuarios y roles" ? <UsersManagement users={users} onCreate={() => setUserOpen(true)} onReset={resetPassword} /> : active === "Permisos" ? <PermissionsPanel users={users} /> : <section className="placeholder-view glass-card"><BookOpen /><h2>{active}</h2><p>Este módulo mantiene la misma estructura administrativa.</p><Button className="primary-float compact" onClick={() => setActive("Panel general")}>Volver al panel</Button></section>;
  } else if (active !== "Inicio" && active !== "Nueva excusa") {
    content = <section className="placeholder-view glass-card"><BookOpen /><h2>{active}</h2><p>Este módulo está listo para continuar su desarrollo.</p><Button className="primary-float compact" onClick={() => setActive("Inicio")}>Volver al inicio</Button></section>;
  } else {
    content = view === "educativa" ? <AdminDashboard excuses={excuses} onOpen={setSelected} onNew={() => setNewOpen(true)} /> : <StudentDashboard excuses={excuses} onOpen={setSelected} onNew={() => setNewOpen(true)} />;
  }
  return <main className="app-shell"><Sidebar role={role} active={active} setActive={(value) => { setActive(value); if (value === "Nueva excusa") setNewOpen(true); }} logout={logout} /><section className="app-content"><Header role={role} />{notice && <div className="toast"><Check />{notice}</div>}{content}</section><NewExcuseDialog open={newOpen} onOpenChange={setNewOpen} onSave={saveExcuse} /><CreateUserDialog open={userOpen} onOpenChange={setUserOpen} onSave={addUser} /><Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}><DialogContent className="dialog-card">{selected && <><DialogHeader><DialogTitle>{selected.reason}</DialogTitle><DialogDescription>{selected.student} · {selected.course} · {selected.date}</DialogDescription></DialogHeader><div className="detail-panel"><StatusBadge status={selected.status} /><p>{selected.detail}</p><div><b>Documento adjunto</b><span><FileText /> soporte-excusa.pdf</span></div></div><DialogFooter>{role !== "estudiante" && <><Button variant="outline" onClick={() => updateStatus("Requiere cambios")}>Solicitar cambios</Button><Button className="approve-btn" onClick={() => updateStatus("Aprobada")}><Check /> Aprobar</Button></>}<Button className="detail-btn" onClick={() => setSelected(null)}>Cerrar</Button></DialogFooter></>}</DialogContent></Dialog></main>;
}

export default function HomePage() { const [session, setSession] = useState<Role | null>(null); return session ? <Dashboard role={session} logout={() => setSession(null)} /> : <Login onLogin={setSession} />; }
