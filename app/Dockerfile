# FIRST STAGE -- BUILD
FROM python:3.11-slim as build
LABEL authors="bsilva-c"

WORKDIR /usr/src/app/
COPY . .

RUN pip install --no-cache-dir -r requirements.txt
RUN rm ./requirements.txt

# SECOND STAGE
FROM gcr.io/distroless/python3-debian12
LABEL authors="bsilva-c"

EXPOSE 8000

USER nonroot
ENV PYTHONPATH="/site-packages/"

# COPY PYTHON PACKAGES && APPLICATION FILES
COPY --from=build /usr/local/lib/python3.11/site-packages/ /site-packages/
COPY --from=build /usr/src/app/ /app/
WORKDIR /app/

CMD ["manage.py", "runserver", "0.0.0.0:8000"]
