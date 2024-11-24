import { Body, Controller, Post, Req } from '@nestjs/common';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthV2Service } from './auth-v2.service';
import { AuthV2Dto } from './dto/auth.dto';
import { RequestResetPasswordDto, ResetPasswordDto } from './dto/reset-password.dto';

@ApiTags('Auth')
@Controller('v2/auth')
export class AuthV2Controller {
    constructor(private readonly authV2Service: AuthV2Service) { }

    @Post('login')
    @ApiOperation({ summary: "Login", description: "Logs in to the system using username and password." })
    @ApiOkResponse({ description: "Logged in successfully." })
    @ApiBadRequestResponse({ description: "Error verifying user credentials." })
    signIn(@Body() dto: AuthV2Dto) {
        return this.authV2Service.signIn(dto);
    }

    @Post('request-reset-password')
    @ApiOperation({ summary: "Request password reset", description: "Allows the user to request a password reset." })
    @ApiCreatedResponse({ description: "Password reset request created successfully." })
    requestPasswordReset(@Body() dto: RequestResetPasswordDto) {
        return this.authV2Service.requestPasswordReset(dto);
    }

    @Post('reset-password')
    @ApiOperation({ summary: "Reset password", description: "Resets the user's password." })
    @ApiCreatedResponse({ description: "User password reset successfully." })
    resetPassword(@Body() dto: ResetPasswordDto) {
        return this.authV2Service.resetPassword(dto);
    }

    @Post('refresh')
    async refreshTokens(@Req() req) {
        const userId = req.user.sub;
        const refreshToken = req.user.refreshToken;
        return this.authV2Service.refresh(userId, refreshToken);
    }

    @Post('logout')
    async logout(@Req() req) {
        const userId = req.user.sub;
        return this.authV2Service.logout(userId);
    }
}
