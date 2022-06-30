import {Chart} from 'chart.js';
import {merge, fromEvent, of, combineLatest, interval, Observable,Subject} from 'rxjs';
import {scan, map} from 'rxjs/operators';
//import {webSocket} from 'rxjs/webSocket';
import socket from "./socketService.js";

let config = {
    type: 'line',
    data: {
        labels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        datasets: [
        ],
    },
    options: {
        legend: {
            onClick: () => {
            },
        },
        animation: false,
        responsive: true,
        tooltips: {
            mode: 'index',
            intersect: false,
        },
        hover: {
            mode: 'nearest',
            intersect: true,
        },

    },
};

let colorMap = {
    ABC: 'rgb(255, 99, 132)',
    DEF: 'rgb(75, 192, 192)',
    GHI: 'rgb(54, 162, 235)',
    JKL: 'rgb(153, 102, 255)',
};

let ctx = document
    .getElementById('my-chart')
    .getContext('2d');

let stockChart = new Chart(ctx, config);

let abcEl = document.querySelector('.abc');
let defEl = document.querySelector('.def');
let ghiEl = document.querySelector('.ghi');
let jklEl = document.querySelector('.jkl');

let mySocketObservable$ = new Observable((observer) => {
    socket.on('stock', (data) => {
        observer.next(data);
    });
    return () => socket.disconnect();
})

// let mySocketSubject$ = new Subject();
//
// socket.on('stock', (data) => {
//     mySocketSubject$.next(data);
// });

let defaultStream$ = mySocketObservable$
    .pipe(
        scan((accumulatedData, nextItem) => {
            accumulatedData.push(nextItem);
            if (accumulatedData.length > 10) {
                // Remove oldest item
                accumulatedData.shift();
            }
           // console.log('accumulatedData' + JSON.stringify(accumulatedData))
            return accumulatedData;
        }, []), // Remember, the second parameter to `scan` is the initial state
        map((newDataSet) => {
            let intermediary = newDataSet.reduce((prev, datum) => {
               // console.log('datum' + JSON.stringify(datum))
                datum.forEach((d) => {
                    if (!prev[d.label]) {
                        prev[d.label] = [];
                    }
                    prev[d.label].push(d.price);
                });
                return prev;
            }, {});
            return Object.keys(intermediary).map((key) => {
                // convert into something chart.js can read
                return {
                    label: key,
                    data: intermediary[key],
                    fill: false,
                    backgroundColor: colorMap[key],
                    borderColor: colorMap[key],
                };
            });
        })
    );


// Stock Filter
function makeCheckboxStream(checkboxEl, stockName) {
    return merge(
        fromEvent(checkboxEl, 'change'),
        // Start off checked
        of({target: {checked: true}})
    ).pipe(
        map((e) => e.target['checked']),
        map((isEnabled) => ({
            isEnabled,
            stock: stockName,
        }))
    );
}

let settings$ = combineLatest([
        makeCheckboxStream(abcEl, 'ABC'),
        makeCheckboxStream(defEl, 'DEF'),
        makeCheckboxStream(ghiEl, 'GHI'),
        makeCheckboxStream(jklEl, 'JKL')
    ],
    (...stockBoxes) => {
        return stockBoxes
            .filter((stockBox) => stockBox.isEnabled)
            .map((stockBox) => stockBox.stock);
    }
);

combineLatest([settings$, defaultStream$], (enabledStocks, stockUpdates) => ({
    enabledStocks,
    stockUpdates,
}))
    .pipe(
        map(({enabledStocks, stockUpdates}) => {
            return stockUpdates
                .filter(stockHistory => enabledStocks.includes(stockHistory.label));
        })
    )
    .subscribe(
        {
            next: (newDataSet) => {
                config.data.datasets = newDataSet;
                stockChart.update();
            },
            error: (err) => console.error(err)
        }
    );
