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

export function* mergeSort(array) {
    const auxArray = alloc_aux(array.length)
    yield auxArray
    yield* mergeSortInner(array, 0, array.length - 1, auxArray._read)
}

function* mergeSortInner(array, start, end, auxArray) {
    const midpoint = Math.floor((start + end) / 2)
    const midpoint_prime = midpoint + 1
    if (end - start > 1) {
        yield* mergeSortInner(array, start, midpoint, auxArray)
        yield* mergeSortInner(array, midpoint_prime, end, auxArray)
    } 

    var firstSegmentValue = access(array, start)
    yield firstSegmentValue

    var secondSegmentValue = access(array, midpoint_prime)
    yield secondSegmentValue

    for (var i = start; i <= end; i++) {
        let value
        if (i == 0) {
            value = firstSegmentValue
        } else if (i == midpoint_prime) {
            value = secondSegmentValue
        } else {
            value = access(array, i)
            yield value
        }
        yield write_aux(auxArray, i, value._read)
    }

    var firstSegmentCounter = start
    var secondSegmentCounter = midpoint_prime 

    for (var i = start; i <= end; i++) {
        if (firstSegmentCounter > midpoint || (
            secondSegmentCounter <= end && secondSegmentValue._read < firstSegmentValue._read
        ) ) {
            yield write(array, i, secondSegmentValue._read)
            if (++secondSegmentCounter <= end) {
                secondSegmentValue = access_aux(auxArray, secondSegmentCounter)
            }
        } else {
            yield write(array, i, firstSegmentValue._read)
            if (++firstSegmentCounter <= end) {
                firstSegmentValue = access_aux(auxArray, firstSegmentCounter)
            }
        }
    }
}

function access(array, i) {
    return {
        _read: array[i],
        accesses: [i],
        value: [array[i]]
    }
}

function access_aux(array, i) {
    return {
        _read: array[i],
        accesses_aux: [i],
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

function write(array, i, value) {
    array[i] = value
    return {
        writes: [i],
        value: [array[i]]
    }
}

function write_aux(array, i, value) {
    array[i] = value
    return {
        writes_aux: [i],
    }
}

function alloc_aux(size) {
    return {
        _read: new Array(size),
        alloc_aux: size
    }
}