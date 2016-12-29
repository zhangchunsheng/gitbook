const Immutable = require('immutable');
const Summary = require('../../../models/summary');
const File = require('../../../models/file');

describe('moveArticleAfter', function() {
    const moveArticleAfter = require('../moveArticleAfter');
    const summary = Summary.createFromParts(File(), [
        {
            articles: [
                {
                    title: '1.1',
                    path: '1.1'
                },
                {
                    title: '1.2',
                    path: '1.2'
                }
            ]
        },
        {
            title: 'Part I',
            articles: [
                {
                    title: '2.1',
                    path: '2.1',
                    articles: [
                        {
                            title: '2.1.1',
                            path: '2.1.1'
                        },
                        {
                            title: '2.1.2',
                            path: '2.1.2'
                        }
                    ]
                },
                {
                    title: '2.2',
                    path: '2.2'
                }
            ]
        }
    ]);

    it('moving right after itself should be invariant', function() {
        const newSummary = moveArticleAfter(summary, '2.1', '2.1');

        expect(Immutable.is(summary, newSummary)).toBe(true);
    });

    it('moving after previous one should be invariant too', function() {
        const newSummary = moveArticleAfter(summary, '2.1', '2.0');

        expect(Immutable.is(summary, newSummary)).toBe(true);
    });

    it('should move an article after a previous level', function() {
        const newSummary = moveArticleAfter(summary, '2.2', '2.0');
        const moved = newSummary.getByLevel('2.1');

        expect(moved.getTitle()).toBe('2.2');
        expect(newSummary.getByLevel('2.2').getTitle()).toBe('2.1');
    });

    it('should move an article after a previous and less deep level', function() {
        const newSummary = moveArticleAfter(summary, '2.1.1', '2.0');
        const moved = newSummary.getByLevel('2.1');

        expect(moved.getTitle()).toBe('2.1.1');
        expect(newSummary.getByLevel('2.2.1').getTitle()).toBe('2.1.2');
        expect(newSummary.getByLevel('2.2').getTitle()).toBe('2.1');
    });

    it('should move an article after a next level', function() {
        const newSummary = moveArticleAfter(summary, '2.1', '2.2');
        const moved = newSummary.getByLevel('2.2');

        expect(moved.getTitle()).toBe('2.1');
        expect(newSummary.getByLevel('2.1').getTitle()).toBe('2.2');
    });

});
