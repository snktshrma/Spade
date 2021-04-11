from transformers import pipeline

def questionAnswer(context, question):
    question_answering = pipeline("question-answering")

    result = question_answering(question=question, context=context)

    answer = result['answer']
    score = result['score']
    
    return score, answer

if __name__ == "__main__":

    context = """
    The founder of LFA is Mr. Dejesus.
    """
    question = "Who is the founder of LFA?"

    score, answer = questionAnswer(context, question)

    print("Answer: ", answer)
    print("Score: ", score)
