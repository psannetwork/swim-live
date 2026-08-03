# NormalizedRace Structure

The `NormalizedRace` interface represents a simplified, UI-ready race structure derived from the raw API `race_list`.

## Field Definition

| Field | Type | Description |
| :--- | :--- | :--- |
| `program_id` | string | Unique program ID |
| `display_program_id` | string | Display program ID |
| `heat` | string | Heat number |
| `race_name` | string | Human-readable race name (e.g., "自由形 女子 50m") |
| `class_name` | string | Class name |
| `division_name` | string | Division name |
| `status` | string | Status text |
| `start_time` | string \| null | Start time |
| `start_list_num` | number | Number of participants |
| `is_finished` | boolean | Finished flag |
| `has_started` | boolean | Started flag |
| `startlist_pub_setting` | string | Readable publishing setting |
| `relay_pub_setting` | string | Readable publishing setting |
| `race_pub_setting` | string | Readable publishing setting |
| `startlist_pub_status` | string | Readable publishing status |
| `relay_order_pub_status` | string | Readable publishing status |
| `race_pub_status` | string | Readable publishing status |
| `program_status` | number | Raw program status code |
| `race_status` | number | Raw race status code |
