import {
  Controller,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Req,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { PortfoliosService } from '../services/portfolios.service';
import { UpdatePortfolioDto } from '../dto/update-portfolio.dto';
import { LocaleCode } from '../enums/locale.enum';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { User } from '../../user/entities/user.entity';

@ApiTags('portfolios')
@Controller('portfolios')
export class PortfoliosController {
  constructor(private readonly portfoliosService: PortfoliosService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user portfolio' })
  @ApiQuery({ name: 'locale', enum: LocaleCode, required: false })
  @ApiResponse({ status: 200, description: 'Returns my portfolio or null' })
  findMe(@Req() req: { user: User }, @Query('locale') locale?: LocaleCode) {
    return this.portfoliosService.findMyPortfolio(req.user, locale);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get portfolio by slug (public)' })
  @ApiParam({ name: 'slug', example: 'nguyen-huu-phuoc' })
  @ApiQuery({ name: 'locale', enum: LocaleCode, required: false })
  @ApiResponse({ status: 200, description: 'Returns full portfolio for the given slug' })
  @ApiResponse({ status: 404, description: 'Portfolio not found' })
  findBySlug(@Param('slug') slug: string, @Query('locale') locale?: LocaleCode) {
    return this.portfoliosService.findBySlug(slug, locale);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update portfolio by id (owner only)' })
  @ApiParam({ name: 'id' })
  @ApiBody({ type: UpdatePortfolioDto })
  @ApiResponse({ status: 200, description: 'Portfolio updated' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Portfolio not found' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdatePortfolioDto,
    @Req() req: { user: User },
  ) {
    return this.portfoliosService.update(id, dto, req.user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete portfolio by id (owner only)' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 204, description: 'Portfolio deleted' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Portfolio not found' })
  remove(@Param('id') id: string, @Req() req: { user: User }) {
    return this.portfoliosService.remove(id, req.user);
  }
}
