const { TestScheduler } = require('rxjs/testing');
const {from, of} = require('rxjs');
const {delay, concatMap} = require('rxjs/operators')
const { deepEqual } = require('assert');
// const {expect} = require('chai');

const {getNames, throttleTimeForThreeMs} = require('../custom-operator');

describe('rxjs with mocha', ()=> {
    let testScheduler;

    beforeEach(()=> {
        testScheduler = new TestScheduler((actual, expected) => {
            deepEqual(actual, expected);
        });
    })

    it('generate the stream correctly', () => {
      testScheduler.run(({ cold, expectObservable, expectSubscriptions, flush }) => {
        const sourceValues = [
            {
                name: 'mocha'
            }
            ,{
                name: 'vanilla'
            }
            ,{
                name: 'caramel'
            }
        ]

        //const e1 =  cold('-0--1--2---|', sourceValues);
        const e1 = from(sourceValues).pipe(
            concatMap(value => {
                return of(value).pipe(delay(2));
            })
        )
        const subs =     '^-----!';
        const expected = '--0---(1|)';


        const resultValues = [
            'mocha',
            'caramel'
        ]

        expectObservable(e1.pipe(getNames, throttleTimeForThreeMs)).toBe(expected, resultValues);

        //flush();
        expectSubscriptions(e1.subscribe()).toBe(subs);
      });
    });
})

