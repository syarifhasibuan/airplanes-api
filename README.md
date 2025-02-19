# Airplanes API

List of airplanes with their respective manufacturers and models.

## REST API

General:

| Method | Path      | Description     | Expectation |
| ------ | --------- | --------------- | ----------- |
| `GET`  | `/`       | API Docs        | 200: HTML   |
| `GET`  | `/search` | Search anything | 200: `[]`   |

Airplanes:

| Method   | Path                | Description               | Expectation              |
| -------- | ------------------- | ------------------------- | ------------------------ |
| `GET`    | `/airplanes`        | Get all airplanes         | 200: `[]`                |
| `GET`    | `/airplanes/search` | Search airplanes by query |                          |
| `GET`    | `/airplanes/:slug`  | Get one airplane by slug  | 200: `{}`, 404           |
| `POST`   | `/airplanes`        | Add a new airplane        | 201: `{...} --> {}`, 400 |
| `DELETE` | `/airplanes`        | Delete all airplanes      | 200: `message`           |
| `DELETE` | `/airplanes/:id`    | Delete airplane by id     | 200: `message`, 404      |
| `PATCH`  | `/airplanes/:id`    | Update airplane by id     | 200: `{...} --> {}`, 404 |

Manufacturer:

| Method  | Path                    | Description                   | Expectation              |
| ------- | ----------------------- | ----------------------------- | ------------------------ |
| `GET`   | `/manufacturers`        | Get all manufacturers         | 200: `[]`                |
| `GET`   | `/manufacturers/search` | Search manufacturers by query |                          |
| `GET`   | `/manufacturers/:slug`  | Get one manufacturer by slug  | 200: `{}`, 404           |
| `POST`  | `/manufacturers`        | Add a new manufacturer        | 201: `{...} --> {}`, 400 |
| `PATCH` | `/manufacturers/:id`    | Update manufacturer by id     | 200: `{...} --> {}`, 404 |

## Development

To install dependencies:

```sh
bun install
```

To run:

```sh
bun run dev
```

Open <http://localhost:3000>
