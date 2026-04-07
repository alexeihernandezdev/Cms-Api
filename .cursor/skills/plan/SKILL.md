---
name: plan
description: >-
  Mantiene AI_CONTEXT.md alineado con el proyecto CMS API. Usar cuando el
  usuario invoque /plan, pida planificar trabajo o dé instrucciones que deban
  quedar reflejadas en el contexto del proyecto (stack, estructura, modelos,
  reglas, backlog).
---

# /plan — Mantenimiento de AI_CONTEXT

## Cuándo aplica

- El usuario escribe **`/update-ai-context`** o pide **planificar**, **actualizar contexto** o **sincronizar AI_CONTEXT**.
- Durante planificación o implementación cuando haya decisiones nuevas que deban persistir para sesiones futuras.

## Archivo obligatorio

- **`AI_CONTEXT.md`** en la raíz del repositorio (misma carpeta que `package.json`).

## Qué hacer tras las instrucciones del usuario

1. **Leer** `AI_CONTEXT.md` si aún no se ha leído en este turno.
2. **Actualizarlo** para que refleje la realidad y la intención:
   - Stack, módulos, roles, modelos Mongoose, reglas de desarrollo: cambiar cuando el usuario o el código diverjan.
   - **Mapa de Funcionalidades (Backlog)**: marcar/desmarcar ítems, añadir hitos o reordenar según prioridades actuales.
   - Añadir notas breves en la sección adecuada si el usuario define endpoints, campos o políticas nuevas.
3. **Conservar** el idioma del documento (español) y la estructura por secciones numeradas salvo que pida reestructurar.
4. **No** sustituir el archivo por una plantilla genérica; **fusionar** cambios para que las secciones no afectadas sigan intactas.

## Qué no hacer

- No omitir la actualización de `AI_CONTEXT.md` cuando las instrucciones cambien alcance, backlog o arquitectura bajo este flujo.
- No duplicar código largo del repo en `AI_CONTEXT.md`; citar rutas de módulos o resumir.

## Lista rápida

- [ ] Instrucciones del usuario recogidas (decisiones, tareas nuevas, deprecaciones).
- [ ] `AI_CONTEXT.md` editado en el repo con los cambios coherentes.
- [ ] Ítems del backlog y casillas alineados con lo acordado.
