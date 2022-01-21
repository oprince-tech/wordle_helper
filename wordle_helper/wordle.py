from __future__ import annotations
import sys
import numpy as np
import pprint


def open_words_len_5(file: str) -> list:
    with open(file, 'r') as f:
        l = f.readlines()
        lines = [k.strip().upper() for k in l if len(k) == 6]
        return lines


def main(greys: list, yellows: list, greens) -> list:
    print(f'{greys=}')
    print(f'{yellows=}')
    print(f'{greens=}')
    words_len_5 = open_words_len_5('wiki-100k-strip-no-dups.txt')
    combinations = np.load('combinations.npy')

    if greys:
        for grey in greys:
            combinations = combinations[~np.any(combinations == grey, axis=1)]
    if yellows:
        for yellow in yellows:
            combinations = combinations[np.any((combinations == yellow[0]), axis=1)]
            combinations = np.delete(combinations, np.where(combinations[:, yellow[1]] == yellow[0]), axis=0)
    if greens:
        for green in greens:
            combinations = combinations[np.where(combinations[:, green[1]] == green[0])]

    words_len_5 = np.asarray(words_len_5)
    combinations = np.apply_along_axis(''.join, 1, combinations)
    combinations = np.pad(combinations, (0, abs(words_len_5.shape[0] - combinations.shape[0])), 'constant')
    matches = np.intersect1d(words_len_5, combinations)
    matches = matches[np.where(matches == words_len_5[:, None])[1]]
    matches_list = matches.tolist()
    return matches_list

if __name__ == '__main__':
    SystemExit(main())
