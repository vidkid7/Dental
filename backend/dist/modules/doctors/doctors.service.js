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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const doctor_entity_1 = require("./entities/doctor.entity");
const doctor_availability_entity_1 = require("./entities/doctor-availability.entity");
const doctor_leave_entity_1 = require("./entities/doctor-leave.entity");
const pagination_dto_1 = require("../../common/dto/pagination.dto");
const date_fns_1 = require("date-fns");
let DoctorsService = class DoctorsService {
    constructor(doctorsRepository, availabilityRepository, leaveRepository) {
        this.doctorsRepository = doctorsRepository;
        this.availabilityRepository = availabilityRepository;
        this.leaveRepository = leaveRepository;
    }
    async create(createDoctorDto) {
        const doctor = this.doctorsRepository.create(createDoctorDto);
        return this.doctorsRepository.save(doctor);
    }
    async findAll(paginationDto) {
        const { page = 1, limit = 10, sortBy = 'name', sortOrder = 'asc', search, departmentId } = paginationDto;
        const queryBuilder = this.doctorsRepository
            .createQueryBuilder('doctor')
            .leftJoinAndSelect('doctor.department', 'department');
        if (search) {
            queryBuilder.andWhere('(doctor.name ILIKE :search OR doctor.specialization ILIKE :search)', { search: `%${search}%` });
        }
        if (departmentId) {
            queryBuilder.andWhere('doctor.departmentId = :departmentId', { departmentId });
        }
        queryBuilder.andWhere('doctor.isActive = :isActive', { isActive: true });
        queryBuilder
            .orderBy(`doctor.${sortBy}`, sortOrder.toUpperCase())
            .skip((page - 1) * limit)
            .take(limit);
        const [doctors, total] = await queryBuilder.getManyAndCount();
        return new pagination_dto_1.PaginatedResponseDto(doctors, total, page, limit);
    }
    async findOne(id) {
        const doctor = await this.doctorsRepository.findOne({
            where: { id },
            relations: ['department', 'availabilities'],
        });
        if (!doctor) {
            throw new common_1.NotFoundException(`Doctor with ID ${id} not found`);
        }
        return doctor;
    }
    async update(id, updateDoctorDto) {
        const doctor = await this.findOne(id);
        if (updateDoctorDto.photo === '') {
            doctor.photo = null;
            const { photo, ...restData } = updateDoctorDto;
            Object.assign(doctor, restData);
        }
        else {
            Object.assign(doctor, updateDoctorDto);
        }
        return this.doctorsRepository.save(doctor);
    }
    async remove(id) {
        const doctor = await this.findOne(id);
        await this.doctorsRepository.remove(doctor);
    }
    async setAvailability(doctorId, availabilityDto) {
        await this.findOne(doctorId);
        const existing = await this.availabilityRepository.findOne({
            where: { doctorId, dayOfWeek: availabilityDto.dayOfWeek },
        });
        if (existing) {
            Object.assign(existing, availabilityDto);
            return this.availabilityRepository.save(existing);
        }
        const availability = this.availabilityRepository.create({
            ...availabilityDto,
            doctorId,
        });
        return this.availabilityRepository.save(availability);
    }
    async getAvailabilities(doctorId) {
        return this.availabilityRepository.find({
            where: { doctorId, isActive: true },
            order: { dayOfWeek: 'ASC' },
        });
    }
    async removeAvailability(doctorId, availabilityId) {
        const availability = await this.availabilityRepository.findOne({
            where: { id: availabilityId, doctorId },
        });
        if (!availability) {
            throw new common_1.NotFoundException('Availability not found');
        }
        await this.availabilityRepository.remove(availability);
    }
    async addLeave(doctorId, leaveDto) {
        await this.findOne(doctorId);
        const leave = this.leaveRepository.create({ ...leaveDto, doctorId });
        return this.leaveRepository.save(leave);
    }
    async getLeaves(doctorId) {
        return this.leaveRepository.find({
            where: { doctorId },
            order: { startDate: 'DESC' },
        });
    }
    async removeLeave(doctorId, leaveId) {
        const leave = await this.leaveRepository.findOne({
            where: { id: leaveId, doctorId },
        });
        if (!leave) {
            throw new common_1.NotFoundException('Leave not found');
        }
        await this.leaveRepository.remove(leave);
    }
    async getAvailableSlots(doctorId, date) {
        const exists = await this.doctorsRepository.findOne({
            where: { id: doctorId, isActive: true },
            select: ['id'],
        });
        if (!exists) {
            return [];
        }
        const dateObj = new Date(date);
        const dayOfWeek = dateObj.getDay();
        const leave = await this.leaveRepository.findOne({
            where: {
                doctorId,
                startDate: (0, typeorm_2.LessThanOrEqual)(date),
                endDate: (0, typeorm_2.MoreThanOrEqual)(date),
            },
        });
        if (leave) {
            return [];
        }
        const availability = await this.availabilityRepository.findOne({
            where: { doctorId, dayOfWeek, isActive: true },
        });
        if (!availability) {
            return [];
        }
        const startStr = typeof availability.startTime === 'string'
            ? availability.startTime.length > 5
                ? availability.startTime.substring(0, 5)
                : availability.startTime
            : '';
        const endStr = typeof availability.endTime === 'string'
            ? availability.endTime.length > 5
                ? availability.endTime.substring(0, 5)
                : availability.endTime
            : '';
        if (!startStr || !endStr || startStr.length < 4 || endStr.length < 4) {
            return [];
        }
        try {
            const startTime = (0, date_fns_1.parse)(startStr, 'HH:mm', new Date());
            const endTime = (0, date_fns_1.parse)(endStr, 'HH:mm', new Date());
            if (Number.isNaN(startTime.getTime()) || Number.isNaN(endTime.getTime())) {
                return [];
            }
            const slotDuration = availability.slotDuration || 30;
            const slots = [];
            let currentSlot = startTime;
            while ((0, date_fns_1.isBefore)(currentSlot, endTime) || (0, date_fns_1.isEqual)(currentSlot, endTime)) {
                const slotEnd = (0, date_fns_1.addMinutes)(currentSlot, slotDuration);
                if ((0, date_fns_1.isAfter)(slotEnd, endTime))
                    break;
                slots.push({
                    startTime: (0, date_fns_1.format)(currentSlot, 'HH:mm'),
                    endTime: (0, date_fns_1.format)(slotEnd, 'HH:mm'),
                });
                currentSlot = slotEnd;
            }
            return slots;
        }
        catch {
            return [];
        }
    }
    async getMergedAvailableSlotsForDate(date) {
        if (!date || typeof date !== 'string' || date.trim() === '') {
            return [];
        }
        const dateTrimmed = date.trim();
        const dateObj = new Date(dateTrimmed);
        if (Number.isNaN(dateObj.getTime())) {
            return [];
        }
        try {
            const doctors = await this.doctorsRepository.find({
                where: { isActive: true },
                select: ['id'],
            });
            const allStarts = new Set();
            for (const d of doctors) {
                try {
                    const slots = await this.getAvailableSlots(d.id, dateTrimmed);
                    for (const s of slots) {
                        const t = s.startTime?.length === 5 ? s.startTime : (s.startTime || '').substring(0, 5);
                        if (t)
                            allStarts.add(t);
                    }
                }
                catch {
                }
            }
            return Array.from(allStarts).sort();
        }
        catch (error) {
            console.error('getMergedAvailableSlotsForDate error:', error);
            return [];
        }
    }
};
exports.DoctorsService = DoctorsService;
exports.DoctorsService = DoctorsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(doctor_entity_1.Doctor)),
    __param(1, (0, typeorm_1.InjectRepository)(doctor_availability_entity_1.DoctorAvailability)),
    __param(2, (0, typeorm_1.InjectRepository)(doctor_leave_entity_1.DoctorLeave)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], DoctorsService);
//# sourceMappingURL=doctors.service.js.map