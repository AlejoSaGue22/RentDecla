"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStoragePath = getStoragePath;
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
function getStoragePath(client, fileName) {
    const uploadDir = process.env.UPLOAD_DIR || './uploads';
    const tenantFolder = sanitizeFolderName(client.tenant?.slug || client.tenantId || 'global');
    const clientFolder = sanitizeFolderName(client.id);
    const relativeDir = path.join(tenantFolder, clientFolder);
    const clientDir = path.join(uploadDir, relativeDir);
    if (!fs.existsSync(clientDir)) {
        fs.mkdirSync(clientDir, { recursive: true });
    }
    const filePath = path.join(clientDir, fileName);
    const fileUrl = `/uploads/${tenantFolder}/${clientFolder}/${fileName}`;
    return { clientDir, filePath, fileUrl };
}
function sanitizeFolderName(name) {
    return name.replace(/[^a-zA-Z0-9_-]/g, '_');
}
//# sourceMappingURL=storage-path.util.js.map