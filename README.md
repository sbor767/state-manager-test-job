# State manager - React.js + TypeScript test job.
*TL;DR*<br>
A simple SPA application that retains its state when navigating to other pages and allows you to restore it from the cache when you return by the browser button `Back`.

## Test task Description for the TypeScript developer
1) You are working on a project that is a typical SPA application. It also has navigation through a typical menu.
2) Each menu item leads to a section (`Section1`, `Section2`), in which you can also go to subsection (`Section1.n`, `Section2.n`, ..).
3) The number of subsections is dynamic, those configuration may come with server (on the task itself is not directly related).
4) Thus, there are root sections referenced by the menu and subsections in each root, in which you can go from the root.
5) Each section contains a typical auto-loadable data list `(List)` with going into it.
6) Clicking on an item in the list navigates to a subsection in which also a list is automatically loaded.
7) A typical list is a linear array data list in which Entities are stored, for example `{id: 1, name: ‘Peter’}`.
8) Each list in the subsection is downloaded by identifier when you click on a link in parent partition.
9) From the subsection, you can go back to the parent section with the browser `back button`. When going back, the parent list should **NOT be downloaded again**, but if go to the parent, and then click again on the same link, the list in the subsection should be downloaded again.
10) Menu is always available.
11) When you click on `any root section` in the menu at any time, the list in this root partition should be downloaded again, even if we have already entered to it and downloaded this list last time.

## Must be implemented conditions
1) To implement the task, you need to use `React.js` or `Vue2`.
2) The task **must be** executed in `TypeScript`.
3) It is not forbidden to use any helpers, etc., but the kernel **must be** written by you.
4) Data load emulation can be used through `Promise.resolve`.

## An example of the desired behavior of the program
1) Clicked on `MenuItem1`.
2) There was a transition to `Section1`. Triggered `List1` autoload (with items `Item1.1`..`Item1.n`).
3) Clicked on `Item1.1`, there was a transition to `Section1.1` and triggered `List1.1` autoload (with items `Item1.1.1`..`Item1.1.n`).
4) Clicked `Back` in the browser, returned to `Section1`. We see a list of `List1`. **No auto-upload**, data is obtained from heap. `List1.1` removed from the heap.
5) Again clicked on `Item1.1` (inside `List1`), again moved to `Section1.1`. Triggered `List1.1` autoload.
6) Clicked on `Item1.1.1`, there was a transition to `Section1.1.1`. Triggered `List1.1.1` autoload.
7) Clicked on `MenuItem2`.
8) There was a transition to `Section2`. Triggered `List2` autoload.
9) `List1`, `List1.1`, `List1.1.1` removed from the heap.
10) Clicked on `MenuItem1`. There was a transition to `Section1`. Triggered `List1` autoload, `List2` removed from the heap and so on.

## Implementation

Selected `React.js` + `ReactRouter` libraries without `Redux` as the task is easier to implement without using it. For educational purposes, state storage was used inside the components, although it would be more convenient to store them in the states of the `ReactRouter`.

## Example website
[State manager](https://www.state-manager-test-job.stripway.ru) - feel free to test it.

## Dependencies
This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app) (`CRA`) - all about it look in `README-CRA.md`. I also used tips on deploying the environment to the `React.js` and `TypeScript` from [TypeScript-React-Starter](https://github.com/Microsoft/TypeScript-React-Starter).

## Working with the Server and Data Locally
See `README-CRA.md`.