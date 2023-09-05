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

export function* insertionSort(array) {
    for (var i = 1; i < array.length; i++) {
        // i only need to access 'current' once, even as its index changes
        const current = access(array, i)
        yield current
        var below = access(array, i - 1)
        yield below
        var j = i
        while (j > 0 && current.value[0] < below.value[0]) {
            yield swap(array, j, --j, current.value[0], below.value[0])
            if (j > 0) {
                below = access(array, j - 1)
                yield below
            }
        }
    }
}

export function* selectionSort(array) {
    for (var i = 0; i < array.length - 1; i++) {
        const current = access(array, i)
        yield current
        var currentLowest = current
        var currentLowestIndex = i
        for (var j = i + 1; j < array.length; j++) {
            const nextNumber = access(array, j);
            yield nextNumber
            if (currentLowest.value[0] > nextNumber.value[0]) {
                currentLowest = nextNumber
                currentLowestIndex = j
            }
        }

        if (i !== currentLowestIndex) {
            yield swap(array, i, currentLowestIndex, current.value[0], currentLowest.value[0])
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