FROM python:3
LABEL authors="bsilva-c"

EXPOSE 8000

WORKDIR /usr/src/app

COPY . .

RUN pip install --no-cache-dir -r requirements.txt

CMD ["python3", "manage.py", "runserver", "0.0.0.0:8000"]
