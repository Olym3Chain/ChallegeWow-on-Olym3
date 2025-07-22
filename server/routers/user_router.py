from fastapi import APIRouter, Body, HTTPException
from fastapi.responses import JSONResponse
from controllers.user_controller import UserController
from enums.leaderboard_period import LEADERBOARD_PERIOD
from models.leaderboard_entry import LeaderboardEntry


def create_user_router(controller: UserController):
    router = APIRouter()

    @router.post("/users/login")
    async def login_user(wallet_id: str = Body(...), username: str = Body(None)):
        return await controller.login_or_create(wallet_id, username)

    @router.get("/users/by-wallet/{wallet_id}")
    async def get_user_by_wallet(wallet_id: str):
        return await controller.get_by_wallet(wallet_id)

    @router.post("/users/update")
    async def update_user(
        wallet_id: str = Body(...), 
        username: str = Body(None), 
        aptos_wallet: str = Body(None)
    ):
        return await controller.update_user(wallet_id, username, aptos_wallet)
    
    @router.get("/users/{wallet_id}/stats")
    async def get_user_stats(wallet_id: str):
        """
        Endpoint: GET /users/{wallet_id}/stats
        """
        try:
            stats = await controller.get_user_stats(wallet_id)
            return JSONResponse(content=stats)
        except HTTPException as e:
            raise e
        except Exception as e:
            print(f"Error in fetch user stats: {e}")
            raise HTTPException(status_code=500, detail=str(e))

    @router.get("/leaderboard", response_model=list[LeaderboardEntry])
    async def leaderboard(limit: int = 10, period = LEADERBOARD_PERIOD.ALL_TIME):
        return await controller.get_leaderboard(limit, period)

    return router
