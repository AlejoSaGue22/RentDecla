"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkflowQueryDto = exports.UpdateWorkflowDto = exports.CreateWorkflowDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const workflow_entity_1 = require("../../../database/entities/workflow.entity");
class CreateWorkflowDto {
    type;
    taxYear;
    dueDate;
    notes;
    clientId;
}
exports.CreateWorkflowDto = CreateWorkflowDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: workflow_entity_1.WorkflowType, default: workflow_entity_1.WorkflowType.DECLARACION_RENTA }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(workflow_entity_1.WorkflowType),
    __metadata("design:type", String)
], CreateWorkflowDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2025 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateWorkflowDto.prototype, "taxYear", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Date)
], CreateWorkflowDto.prototype, "dueDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateWorkflowDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateWorkflowDto.prototype, "clientId", void 0);
class UpdateWorkflowDto {
    type;
    taxYear;
    dueDate;
    notes;
}
exports.UpdateWorkflowDto = UpdateWorkflowDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, enum: workflow_entity_1.WorkflowType }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(workflow_entity_1.WorkflowType),
    __metadata("design:type", String)
], UpdateWorkflowDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateWorkflowDto.prototype, "taxYear", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Date)
], UpdateWorkflowDto.prototype, "dueDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateWorkflowDto.prototype, "notes", void 0);
class WorkflowQueryDto {
    status;
    clientId;
    taxYear;
}
exports.WorkflowQueryDto = WorkflowQueryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, enum: workflow_entity_1.WorkflowStatus }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(workflow_entity_1.WorkflowStatus),
    __metadata("design:type", String)
], WorkflowQueryDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], WorkflowQueryDto.prototype, "clientId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], WorkflowQueryDto.prototype, "taxYear", void 0);
//# sourceMappingURL=workflow.dto.js.map