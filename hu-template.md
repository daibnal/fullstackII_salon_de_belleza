---
name: HU-Template
about: Para usar en historias de usuario
title: ''
labels: ''
assignees: ''

---

## Historia de usuario 01

**Como** [Cliente]

**Quiero** [registrarme en la plataforma ingresando mis datos personales (nombre, correo y contraseña)]

**Para** [acceder al sistema y gestionar mis reservas personales]

## Criterios de aceptación

- [ ] **Escenario 1: [Nombre del escenario]**

```gherkin
Dado [que un nuevo usuario ingresa al formulario de registro]
Cuando [completa los campos requeridos con un correo válido y contraseña segura]
Entonces [el sistema debe crear la cuenta con rol de "Cliente"]
```

 - [ ] **Escenario 2: [Nombre del escenario]**

```gherkin
Dado [ que el usuario intenta registrarse con un correo electrónico que ya existe en la base de datos]
Cuando [envía el formulario]
Entonces [el sistema debe denegar el registro y mostrar una advertencia]
```

**Observaciones**
Add any other context or screenshots about the feature request here.

---

## Historia de usuario 02

**Como** [Cliente/Administrador]

**Quiero** [iniciar sesión ingresando mi correo y contraseña]

**Para** [acceder a las funciones correspondientes a mi perfil]

## Criterios de aceptación

- [ ] **Escenario 1: [Nombre del escenario]**

```gherkin
Dado [el usuario se encuentra en la pantalla de login]
Cuando [ingresa credenciales válidas y presiona entrar]
Entonces [el sistema debe autenticarlo y redirigirlo a su panel correspondiente]
```

 - [ ] **Escenario 2: [Nombre del escenario]**

```gherkin
Dado [el usuario ingresa un correo o contraseña incorrectos]
Cuando [intenta iniciar sesión]
Entonces [el sistema debe mostrar un mensaje de error y bloquear el acceso tras varios intentos fallidos]
```

**Observaciones**
Add any other context or screenshots about the feature request here.

---

## Historia de usuario 03

**Como** [Cliente]

**Quiero** [seleccionar un servicio, profesional, fecha y hora disponible en el sistema]

**Para** [agendar una cita de manera autónoma sin necesidad de contactar al salón]

## Criterios de aceptación

- [ ] **Escenario 1: [Nombre del escenario]**

```gherkin
Dado [el cliente se encuentra en la sección de agendamiento y selecciona un servicio y un profesional]
Cuando [visualiza el calendario y selecciona una fecha y hora disponible]
Entonces [el sistema debe bloquear temporalmente ese espacio de tiempo para evitar solapamientos y solicitar la confirmación]
```

 - [ ] **Escenario 2: [Nombre del escenario]**

```gherkin
Dado [el cliente selecciona un horario que ya ha sido reservado]
Cuando [intenta confirmar la selección]
Entonces [el sistema debe mostrar un mensaje de error indicando que el horario ya no está disponible]
```
- [ ] **Escenario 3: [Nombre del escenario]**

```gherkin
Dado [el usuario intenta agendar una cita en un horario bloqueado por la administración]
Cuando [selecciona dicho espacio]
Entonces [el sistema debe impedir la selección y mostrar un aviso de indisponibilidad]
```

**Observaciones**
Add any other context or screenshots about the feature request here.

---

## Historia de usuario 04

**Como** [Administrador]

**Quiero** [visualizar la agenda de citas del salón en formato diario, semanal y mensual]

**Para** [supervisar la ocupación de turnos, la disponibilidad del personal y el flujo de atención]

## Criterios de aceptación

- [ ] **Escenario 1: [Nombre del escenario]**

```gherkin
Dado [el administrador ingresa al módulo de agenda y selecciona una vista (diaria, semanal o mensual)]
Cuando [carga la página]
Entonces [el sistema debe mostrar todas las citas programadas organizadas cronológicamente]
```

 - [ ] **Escenario 2: [Nombre del escenario]**

```gherkin
Dado [el usuario intenta agendar una cita en un horario bloqueado por la administración]
Cuando [selecciona dicho espacio]
Entonces [el sistema debe impedir la selección y mostrar un aviso de indisponibilidad]
```

**Observaciones**
Add any other context or screenshots about the feature request here.

---

## Historia de usuario 05

**Como** [Cliente]

**Quiero** [modificar la fecha/hora o cancelar una reserva existente]

**Para** [gestionar imprevistos de tiempo de manera autónoma]

## Criterios de aceptación

- [ ] **Escenario 1: [Nombre del escenario]**

```gherkin
Dado [el cliente accede a sus reservas activas y selecciona una cita]
Cuando [elige la opción de cancelar y confirma la acción]
Entonces [el sistema debe liberar el horario en la agenda y registrar el estado como "Cancelada"]
```

 - [ ] **Escenario 2: [Nombre del escenario]**

```gherkin
Dado [el usuario intenta agendar una cita en un horario bloqueado por la administración]
Cuando [selecciona dicho espacio]
Entonces [el sistema debe impedir la selección y mostrar un aviso de indisponibilidad]
```

**Observaciones**
Add any other context or screenshots about the feature request here.

---

## Historia de usuario 06

**Como** [Administrador]

**Quiero** [modificar o cancelar cualquier cita desde el panel de control]

**Para** [gestionar ajustes de última hora o imprevistos operativos del salón]

## Criterios de aceptación

- [ ] **Escenario 1: [Nombre del escenario]**

```gherkin
Dado [el administrador selecciona una cita en la agenda global]
Cuando [ejecuta una modificación de horario o cancelación administrativa]
Entonces [el sistema debe actualizar el calendario y notificar al cliente]
```

 - [ ] **Escenario 2: [Nombre del escenario]**

```gherkin
Dado [el usuario intenta agendar una cita en un horario bloqueado por la administración]
Cuando [selecciona dicho espacio]
Entonces [el sistema debe impedir la selección y mostrar un aviso de indisponibilidad]
```

**Observaciones**
Add any other context or screenshots about the feature request here.

---

## Historia de usuario 07

**Como** [Administrador]

**Quiero** [filtrar la vista de la agenda por un profesional específico o por estado de cita (Pendiente, Confirmada, Completada)]

**Para** [ revisar de forma segmentada los compromisos operativos]

## Criterios de aceptación

- [ ] **Escenario 1: [Nombre del escenario]**

```gherkin
Dado [el administrador se encuentra en la agenda]
Cuando [aplica un filtro por un profesional]
Entonces [el sistema debe mostrar exclusivamente las citas asignadas a dicho trabajador]
```

 - [ ] **Escenario 2: [Nombre del escenario]**

```gherkin
Dado [el usuario intenta agendar una cita en un horario bloqueado por la administración]
Cuando [selecciona dicho espacio]
Entonces [el sistema debe impedir la selección y mostrar un aviso de indisponibilidad]
```

**Observaciones**
Add any other context or screenshots about the feature request here.

---

## Historia de usuario 08

**Como** [Cliente]

**Quiero** [consultar un historial con todas mis reservas pasadas y actuales]

**Para** [recordar los servicios que me he realizado y sus estados]

## Criterios de aceptación

- [ ] **Escenario 1: [Nombre del escenario]**

```gherkin
Dado [el cliente ingresa a su perfil en "Mis Reservas"]
Cuando [revisa el listado]
Entonces [el sistema debe mostrar el desglose de citas anteriores con su respectivo estado, servicio y profesional]
```

 - [ ] **Escenario 2: [Nombre del escenario]**

```gherkin
Dado [el usuario intenta agendar una cita en un horario bloqueado por la administración]
Cuando [selecciona dicho espacio]
Entonces [el sistema debe impedir la selección y mostrar un aviso de indisponibilidad]
```

**Observaciones**
Add any other context or screenshots about the feature request here.

---

## Historia de usuario 09

**Como** [Administrador]

**Quiero** [bloquear franjas horarias específicas en la agenda (mantenimiento, festivos o reuniones)]

**Para** [impedir que los clientes agenden citas en momentos donde el salón no operará]

## Criterios de aceptación

- [ ] **Escenario 1: [Nombre del escenario]**

```gherkin
Dado [el administrador selecciona una fecha y rango de horas y aplica "Bloquear Horario"]
Cuando [confirma]
Entonces [el sistema debe marcar dicho intervalo como no disponible para los clientes]
```

 - [ ] **Escenario 2: [Nombre del escenario]**

```gherkin
Dado [el usuario intenta agendar una cita en un horario bloqueado por la administración]
Cuando [selecciona dicho espacio]
Entonces [el sistema debe impedir la selección y mostrar un aviso de indisponibilidad]
```

**Observaciones**
Add any other context or screenshots about the feature request here.

---

## Historia de usuario 10

**Como** [Sistema]

**Quiero** [enviar correos automáticos de confirmación al reservar y recordatorios 24 horas antes]

**Para** [garantizar que el cliente tenga el respaldo y reducir las inasistencias]

## Criterios de aceptación

- [ ] **Escenario 1: [Nombre del escenario]**

```gherkin
Dado [el cliente llega al salón para su cita]
Cuando [el administrador hace clic en "Marcar Asistencia" en la cita correspondiente]
Entonces [el estado de la cita debe cambiar a "En proceso"]
```

 - [ ] **Escenario 2: [Nombre del escenario]**

```gherkin
Dado [el usuario intenta agendar una cita en un horario bloqueado por la administración]
Cuando [selecciona dicho espacio]
Entonces [el sistema debe impedir la selección y mostrar un aviso de indisponibilidad]
```

**Observaciones**
Add any other context or screenshots about the feature request here.

---

## Historia de usuario 11

**Como** [Administrador]

**Quiero** [marcar el estado de asistencia del cliente cuando se presenta al salón]

**Para** [llevar el control de puntualidad y dar inicio formal a la atención]

## Criterios de aceptación

- [ ] **Escenario 1: [Nombre del escenario]**

```gherkin
Dado [el cliente llega al salón para su cita]
Cuando [el administrador hace clic en "Marcar Asistencia" en la cita correspondiente]
Entonces [el estado de la cita debe cambiar a "En proceso"]
```

 - [ ] **Escenario 2: [Nombre del escenario]**

```gherkin
Dado [el usuario intenta agendar una cita en un horario bloqueado por la administración]
Cuando [selecciona dicho espacio]
Entonces [el sistema debe impedir la selección y mostrar un aviso de indisponibilidad]
```

**Observaciones**
Add any other context or screenshots about the feature request here.
