export function* bubbleSort(array) {
    for (var i = 0; i < array.length ; i++) {
        for (var j = 0; j < array.length - i - 1; j++) {
            const second = access(array, j + 1)
            yield second;
            const first = access(array, j)
            yield first;
            if (first.value[0] > second.value[0]) {
                yield swap(array, j, j+1, first.value[0], second.value[0]);
            }
        }
    }
}

function access(array, i) {
    return {
        accesses: [i],
        value: [array[i]]
    }
}

function swap(array, i, j, first = access(i), second = access(j)) {
    var realFirst 
    var realSecond

    if (first.accesses) {
        realFirst = first.value
    }

    if (second.accesses) {
        realSecond = second.value
    }

    array[i] = second
    array[j] = first
    return {
        writes: [i, j],
        value: [realFirst, realSecond]
    }
}