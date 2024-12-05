import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthV2Guard } from './auth-v2.guard';
import { AuthV2Service } from './auth-v2.service';
import { AuthV2Dto } from './dto/auth.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RequestResetPasswordDto, ResetPasswordDto } from './dto/reset-password.dto';

@ApiTags('Auth')
@Controller('v2/auth')
export class AuthV2Controller {
    constructor(private readonly authV2Service: AuthV2Service) { }

    @Post('login')
    @HttpCode(HttpStatus.OK)
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
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "Refresh token", description: "Generate a new access token using a valid refresh token. This endpoint helps maintain user session without re-authentication." })
    @ApiOkResponse({ description: "Token generated with successfully." })
    @ApiBadRequestResponse({ description: "Error verifying user credentials." })
    async refreshToken(@Body() dto: RefreshTokenDto) {
        return this.authV2Service.refresh(dto);
    }

    @UseGuards(AuthV2Guard)
    @Post('logout')
    @ApiOperation({ summary: "Logout", description: "Log out the user by their current session or token." })
    @ApiOkResponse({ description: "Successfully logged out." })
    @ApiBadRequestResponse({ description: "Error logging out the user." })
    async logout(@Req() req) {
        const userId = req.user.sub;
        return this.authV2Service.logout(userId);
    }
}
