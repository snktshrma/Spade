from transformers import pipeline

def questionAnswer(context, question):
    question_answering = pipeline("question-answering")

    result = question_answering(question=question, context=context)

    answer = result['answer']
    score = result['score']
    
    return score, answer


if __name__ == "__main__":

    context = """
    Machine learning (ML) is the study of computer algorithms that improve automatically through experience. It is seen as a part of artificial intelligence. Machine learning algorithms build a model based on sample data, known as "training data", in order to make predictions or decisions without being explicitly programmed to do so. Machine learning algorithms are used in a wide variety of applications, such as email filtering and computer vision, where it is difficult or unfeasible to develop conventional algorithms to perform the needed tasks.
    """
    question = "What are machine learning models based on?"

    score, answer = questionAnswer(context, question)

    print("Answer: ", answer)
    print("Score: ", score)
