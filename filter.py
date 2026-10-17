with open("words.txt", "r") as f:
    words=f.readlines()

f = open("filtered_words.txt", 'w')

for i in range(len(words)):
    words[i]=words[i].strip()
    dif_letters=set(words[i])
    if len(words[i])>3 and len(dif_letters)<8:
        f.write(words[i].upper()+'\n')

