from uuid import UUID
from typing import List, Dict, Any, Optional
from psycopg import Connection


# Define achievement thresholds for location-based achievements
LOCATION_ACHIEVEMENTS = [
    {"name": "Pierwsze kroki", "description": "Found your first location!", "threshold": 1},
    {"name": "Odkrywca", "description": "Odnalazłeś 5 miejsc!", "threshold": 5},
    {"name": "Poszukiwacz przygód", "description": " 10 miejsc!", "threshold": 10},
    {"name": "Badacz", "description": "Odnaleziono 25 miejsc!", "threshold": 25},
    {"name": "Bydgoski mistrz", "description": "Odnalaziono wszystkie miejsca!", "threshold": -1},
]


def check_and_unlock_achievements(user_id: UUID, conn: Connection) -> List[Dict[str, Any]]:
    newly_unlocked = []

    with conn.cursor() as cur:
        # Get user's found locations count
        cur.execute(
            "SELECT COALESCE(array_length(found_locs, 1), 0) FROM users WHERE id = %s",
            (str(user_id),)
        )
        result = cur.fetchone()
        if result is None:
            return []

        found_count = result[0]

        # Check each achievement threshold
        for achievement in LOCATION_ACHIEVEMENTS:
            if found_count >= achievement["threshold"]:
                # Check if already unlocked
                cur.execute(
                    """
                    SELECT 1 FROM user_achievements ua
                    JOIN achievements a ON ua.achievement_id = a.id
                    WHERE ua.user_id = %s AND a.threshold = %s
                    """,
                    (str(user_id), achievement["threshold"])
                )

                if cur.fetchone() is None:
                    # Get achievement id and unlock it
                    cur.execute(
                        "SELECT id FROM achievements WHERE threshold = %s",
                        (achievement["threshold"],)
                    )
                    achievement_row = cur.fetchone()

                    if achievement_row:
                        cur.execute(
                            """
                            INSERT INTO user_achievements (user_id, achievement_id)
                            VALUES (%s, %s)
                            ON CONFLICT DO NOTHING
                            """,
                            (str(user_id), achievement_row[0])
                        )
                        newly_unlocked.append({
                            "name": achievement["name"],
                            "description": achievement["description"],
                            "threshold": achievement["threshold"]
                        })

        conn.commit()

    return newly_unlocked


def get_user_achievements(user_id: UUID, conn: Connection) -> Dict[str, Any]:
    with conn.cursor() as cur:
        cur.execute("SELECT id, name, description, threshold FROM achievements ORDER BY threshold")
        all_achievements = cur.fetchall()

        cur.execute(
            """
            SELECT achievement_id, unlocked_at FROM user_achievements
            WHERE user_id = %s
            """,
            (str(user_id),)
        )
        unlocked = {str(row[0]): row[1] for row in cur.fetchall()}

        # Get user's current progress
        cur.execute(
            "SELECT COALESCE(array_length(found_locs, 1), 0) FROM users WHERE id = %s",
            (str(user_id),)
        )
        result = cur.fetchone()
        found_count = result[0] if result else 0

        achievements = []
        for ach in all_achievements:
            ach_id = str(ach[0])
            achievements.append({
                "id": ach_id,
                "name": ach[1],
                "description": ach[2],
                "threshold": ach[3],
                "unlocked": ach_id in unlocked,
                "unlocked_at": unlocked[ach_id].isoformat() if ach_id in unlocked else None,
                "progress": min(found_count, ach[3]),
            })

        return {
            "user_id": str(user_id),
            "found_locations": found_count,
            "achievements": achievements,
            "unlocked_count": len(unlocked),
            "total_count": len(all_achievements)
        }


def seed_achievements(conn: Connection) -> None:
    with conn.cursor() as cur:
        for achievement in LOCATION_ACHIEVEMENTS:
            cur.execute(
                """
                INSERT INTO achievements (name, description, threshold, icon)
                VALUES (%s, %s, %s, %s)
                ON CONFLICT (threshold) DO NOTHING
                """,
                (achievement["name"], achievement["description"],
                 achievement["threshold"])
            )
        conn.commit()
