/* Module Description */
/* Locates and records quiz questions that have known issues when importing into Canvas. */

/* Put dependencies here */
const asyncLib = require('async');
const he = require('he');
const cheerio = require('cheerio');

module.exports = (course, stepCallback) => {

    /* Our Info locations for various things we find */
    course.newInfo('questionTypes', {
        ordering: [],
        multiBlank: [],
        matching: [],
        multiSelect: [],
        multiShortAnswer: [],
        randomized: [],
        arithmetic: [],
        sigFigure: [],
    });

    var quizTitle;

    /* Question types that have issues:
    -- Multi-Select | Turns into a multi-choice, single-select issue
    -- Multiple Short Answer | Only has one fill-in-the-blank in Canvas
    -- Matching | Swaps sides of definitions/answers
    -- Ordering | This type doesn't exist in Canvas - imports as "Error" type
    -- Randomized | You can't randomize answers in Canvas
    -- Arithmetic | Must be re-authored as formula questions and indicate variables with []
    -- Significant Figures | Same as above */

    /* Check the Question Type */
    function questionType($, question) {
        
        var questionData = {
            'Quiz': quizTitle,
            'Question Title': '',
            'Type': '',
            'Randomized': false
        };

        /* Get and set the question title */
        var questionTitle = $(question).find('presentation>flow>material>mattext').text();
        questionData['Question Title'] = cheerio.load(he.decode(questionTitle)).text();

        /* Get the type field from the XML */
        var typeField = $(question).find('fieldlabel').filter((index, label) => {
            return $(label).text() == 'qmd_questiontype';
        });

        /* Get the type of the question and set it on the object*/
        questionData['Type'] = $(typeField).next().text();

        /* If the answers are randomized */
        var randomized = $(question).find('render_choice').attr('shuffle');
        if (randomized === 'yes') {
            questionData['Randomized'] = true;
        }

        course.log('Questions with Import Issues', questionData);

    }

    /* Get the manifest */
    var quizFiles = course.content.filter(file => file.name.includes('quiz_d2l_'));

    /* For each quiz ... */
    asyncLib.each(quizFiles, (quizFile, eachCallback) => {
        var $;

        $ = quizFile.dom;
        quizTitle = $('assessment').attr('title');

        /* Get all the quiz questions and run our test functions */
        $('item').each((index, question) => {
            /* Tests go here */
            questionType($, question);
        });

        /* When we're done running tests... */
        eachCallback(null);

    }, (eachErr) => {
        if (eachErr) {
            course.throwErr('question-issues-report', eachErr);
            stepCallback(null, course);
            return;
        }
        stepCallback(null, course);
    });
    
};
