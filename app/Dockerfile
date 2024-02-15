# FIRST STAGE -- BUILD
FROM python:3.11-slim as build
LABEL authors="bsilva-c"

WORKDIR /usr/src/app/
COPY . .

RUN pip install --no-cache-dir -r requirements.txt
RUN rm ./requirements.txt

# SECOND STAGE -- DEV
FROM python:3.11-slim as dev
LABEL authors="bsilva-c"

EXPOSE 8000

ENV PYTHONPATH="/site-packages/"
ENV DEBUG=True

COPY --from=build /usr/local/lib/python3.11/site-packages/ /site-packages/

WORKDIR /app/

CMD ["python3", "manage.py", "runserver", "0.0.0.0:8000"]

# SECOND STAGE -- PROD
FROM gcr.io/distroless/python3-debian12 as prod
LABEL authors="bsilva-c"

EXPOSE 8000

USER nonroot
ENV PYTHONPATH="/site-packages/"
ENV DEBUG=False

COPY --from=build /usr/local/lib/python3.11/site-packages/ /site-packages/
COPY --from=build /usr/src/app/ /app/

WORKDIR /app/

CMD ["manage.py", "runserver", "0.0.0.0:8000"]

# SECOND STAGE -- TOOLS
FROM python:3.11-slim as tools
LABEL authors="bsilva-c"

ENV PYTHONPATH="/site-packages/"

COPY --from=build /usr/local/lib/python3.11/site-packages/ /site-packages/
COPY --from=build /usr/src/app/ /app/

WORKDIR /app/tools/
