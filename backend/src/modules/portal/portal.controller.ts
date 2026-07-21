import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { PortalService } from './portal.service';
import { UpdatePortalProfileDto } from './dto/update-profile.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/decorators/roles.decorator';

@ApiTags('Portal del Cliente')
@Controller('portal')
@Roles(UserRole.CLIENT)
export class PortalController {
  constructor(private readonly portalService: PortalService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get client own profile with summary' })
  getProfile(@CurrentUser() user: any) {
    return this.portalService.getProfile(user);
  }

  @Get('documents')
  @ApiOperation({ summary: 'Get client own documents' })
  getDocuments(@CurrentUser() user: any) {
    return this.portalService.getDocuments(user);
  }

  @Post('documents/upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload a document from client portal' })
  uploadDocument(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: any,
    @Body('category') category?: string,
    @Body('documentRequestId') documentRequestId?: string,
  ) {
    return this.portalService.uploadDocument(file, user, category, documentRequestId);
  }

  @Get('document-requests')
  @ApiOperation({ summary: 'Get client document requests (checklist)' })
  getDocumentRequests(@CurrentUser() user: any) {
    return this.portalService.getDocumentRequests(user);
  }

  @Get('workflows')
  @ApiOperation({ summary: 'Get client workflows' })
  getWorkflows(@CurrentUser() user: any) {
    return this.portalService.getWorkflows(user);
  }

  @Get('notifications')
  @ApiOperation({ summary: 'Get client notifications' })
  getNotifications(@CurrentUser() user: any) {
    return this.portalService.getNotifications(user);
  }

  @Patch('notifications/:id/read')
  @ApiOperation({ summary: 'Mark notification as read' })
  markNotificationRead(@Param('id') id: string) {
    return this.portalService.markNotificationRead(id);
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Update client tax profile' })
  updateProfile(
    @CurrentUser() user: any,
    @Body() dto: UpdatePortalProfileDto,
  ) {
    return this.portalService.updateProfile(user, dto);
  }
}
