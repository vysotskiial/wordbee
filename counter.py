from collections import Counter
import random
import json

f = open("filtered_words.txt", 'r')
words=f.readlines()
f.close()

let_counter=Counter()

for i in range(len(words)):
    words[i]=words[i].strip()
    let_counter+=Counter(words[i])
total=let_counter.total()
proportions = {item: count/total for item, count in let_counter.items()}

proportions = dict(sorted(proportions.items(), key=lambda item: item[1],reverse=True))
{0: 0, 2: 1, 1: 2, 4: 3, 3: 4}

probabilities={}
prev_val=0
for k, v in proportions.items():
    probabilities[k] = prev_val+v
    prev_val=probabilities[k] 

#print(num)

good_let=[]

#with open("probabilities.json", "w") as f:
#    json.dump(probabilities, f, indent=4)

for k, v in probabilities.items():
    print(f"'{k}':{v},")
while len(good_let)<7:
    num = random.uniform(0.0, 0.9999999999999998)
    for k, v in probabilities.items():
        if num < v and k not in good_let:
            good_let.append(k)
            break

print(good_let)
