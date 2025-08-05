# Trailblazer v3.0

A 3D pathfinder. Select a start and end point and choose an algorithm to find the shortest path between the two points.

## Preview

[Newer version](public/)

[Previous version](public/v2-demo.mp4)

https://github.com/user-attachments/assets/5c2f0959-d97c-4d7b-bf69-9e833c6d3da6

## Development

`pnpn i && pnpm dev`

## Tech

Typescript, React, Vite, Valtio, Tailwind, Three.js, React Three Fiber, React Three Drei

## To-Do

- [X] Make setting resizable
- [x] Sync with local storage
- [x] If it has been a few seconds since the last user interaction, start slowly rotating the cube
- [x] Make notification system for error reporting like "start end needs to be set before running algorithm"
- Look into [violations](https://chromestatus.com/feature/5745543795965952) - Added non-passive event listener to a scroll-blocking 'wheel' event.
- Add react compiler
- [x] Dismiss btn inside toast
- [X] Add bounds to draggable settings
- [x] Add sound ~when moving cursor along the nodes~
- [x] Hide/Unhide settings
- [x] Add animations

## Acknowledgment

