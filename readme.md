# Question Issues Report
### *Package Name*: question-issues-report
### *Child Type*: Pre-import
### *Platform*: all
### *Required*: To be determined

This child module is built to be used by the Brigham Young University - Idaho D2L to Canvas Conversion Tool. It utilizes the standard `module.exports => (course, stepCallback)` signature and uses the Conversion Tool's standard logging functions. You can view extended documentation [Here](https://github.com/byuitechops/d2l-to-canvas-conversion-tool/tree/master/documentation).

## Purpose
This child module finds and stores references to quiz questions of types that do not exist in Canvas. 

Finds and stores for the report: Ordering, Significant Figure, Arithmetic, Multi-Short Answer, Matching, Multi-Select, and Randomized questions.

## How to Install

```
npm install question-issues-report
```

## Run Requirements
course.content is required for this child module to run.

## Options
None

## Outputs
| Option | Type | Location |
|--------|--------|-------------|
|questionTypes| Object | course.info|

## Process
1. loop through each quiz in the manifest
2. Test each quiz question by quiz type
3. If quiz type is flagged, add it to course.info

## Log Categories
Categories used in logging data in this module.
- Questions with Import Issues

## Requirements
Flag quizzes that will not work in Canvas so they can be easily found & fixed.