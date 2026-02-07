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
exports.AppointmentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const appointment_entity_1 = require("./entities/appointment.entity");
const pagination_dto_1 = require("../../common/dto/pagination.dto");
const doctors_service_1 = require("../doctors/doctors.service");
const date_fns_1 = require("date-fns");
function toTimeString(t) {
    if (!t || typeof t !== 'string')
        return '09:00:00';
    const parts = t.trim().split(':');
    const h = parts[0]?.padStart(2, '0') || '00';
    const m = (parts[1] ?? '00').padStart(2, '0');
    const s = (parts[2] ?? '00').padStart(2, '0');
    return `${h}:${m}:${s}`;
}
let AppointmentsService = class AppointmentsService {
    constructor(appointmentsRepository, doctorsService) {
        this.appointmentsRepository = appointmentsRepository;
        this.doctorsService = doctorsService;
    }
    async create(createAppointmentDto) {
        const { doctorId, date, startTime } = createAppointmentDto;
        const availableSlots = await this.doctorsService.getAvailableSlots(doctorId, date);
        if (!availableSlots || availableSlots.length === 0) {
            throw new common_1.BadRequestException('Doctor is not available on this day. Please select another date.');
        }
        const normalizedStartTime = startTime.length === 5 ? startTime : startTime.substring(0, 5);
        const slot = availableSlots.find((s) => {
            const st = s.startTime?.length === 5 ? s.startTime : (s.startTime || '').substring(0, 5);
            return st === normalizedStartTime;
        });
        if (!slot) {
            const availableTimes = availableSlots
                .map((s) => (s.startTime?.length === 5 ? s.startTime : (s.startTime || '').substring(0, 5)))
                .join(', ');
            throw new common_1.BadRequestException(`Selected time (${startTime}) is not available for this doctor on ${date}. Available times: ${availableTimes}`);
        }
        const startTimeDb = toTimeString(startTime);
        const endTimeDb = toTimeString(slot.endTime);
        const existingAppointment = await this.appointmentsRepository.findOne({
            where: {
                doctorId,
                date,
                startTime: startTimeDb,
                status: appointment_entity_1.AppointmentStatus.PENDING,
            },
        });
        if (existingAppointment) {
            throw new common_1.BadRequestException('This time slot is already booked');
        }
        const confirmedAppointment = await this.appointmentsRepository.findOne({
            where: {
                doctorId,
                date,
                startTime: startTimeDb,
                status: appointment_entity_1.AppointmentStatus.CONFIRMED,
            },
        });
        if (confirmedAppointment) {
            throw new common_1.BadRequestException('This time slot is already booked');
        }
        const appointment = this.appointmentsRepository.create({
            ...createAppointmentDto,
            startTime: startTimeDb,
            endTime: endTimeDb,
            status: appointment_entity_1.AppointmentStatus.PENDING,
        });
        const savedAppointment = await this.appointmentsRepository.save(appointment);
        return savedAppointment;
    }
    async findAll(paginationDto) {
        const { page = 1, limit = 10, sortBy = 'date', sortOrder = 'desc', doctorId, status, startDate, endDate, } = paginationDto;
        const queryBuilder = this.appointmentsRepository
            .createQueryBuilder('appointment')
            .leftJoinAndSelect('appointment.doctor', 'doctor');
        if (doctorId) {
            queryBuilder.andWhere('appointment.doctorId = :doctorId', { doctorId });
        }
        if (status) {
            queryBuilder.andWhere('appointment.status = :status', { status });
        }
        if (startDate && endDate) {
            queryBuilder.andWhere('appointment.date BETWEEN :startDate AND :endDate', {
                startDate,
                endDate,
            });
        }
        queryBuilder
            .orderBy(`appointment.${sortBy}`, sortOrder.toUpperCase())
            .addOrderBy('appointment.startTime', 'ASC')
            .skip((page - 1) * limit)
            .take(limit);
        const [appointments, total] = await queryBuilder.getManyAndCount();
        return new pagination_dto_1.PaginatedResponseDto(appointments, total, page, limit);
    }
    async findOne(id) {
        const appointment = await this.appointmentsRepository.findOne({
            where: { id },
            relations: ['doctor'],
        });
        if (!appointment) {
            throw new common_1.NotFoundException(`Appointment with ID ${id} not found`);
        }
        return appointment;
    }
    async update(id, updateAppointmentDto) {
        const appointment = await this.findOne(id);
        Object.assign(appointment, updateAppointmentDto);
        return this.appointmentsRepository.save(appointment);
    }
    async cancel(id, reason) {
        const appointment = await this.findOne(id);
        appointment.status = appointment_entity_1.AppointmentStatus.CANCELLED;
        appointment.cancellationReason = reason;
        return this.appointmentsRepository.save(appointment);
    }
    async confirm(id) {
        const appointment = await this.findOne(id);
        appointment.status = appointment_entity_1.AppointmentStatus.CONFIRMED;
        const savedAppointment = await this.appointmentsRepository.save(appointment);
        return savedAppointment;
    }
    async complete(id) {
        const appointment = await this.findOne(id);
        appointment.status = appointment_entity_1.AppointmentStatus.COMPLETED;
        return this.appointmentsRepository.save(appointment);
    }
    async markNoShow(id) {
        const appointment = await this.findOne(id);
        appointment.status = appointment_entity_1.AppointmentStatus.NO_SHOW;
        return this.appointmentsRepository.save(appointment);
    }
    async getAppointmentsByDoctor(doctorId, date) {
        return this.appointmentsRepository.find({
            where: {
                doctorId,
                date,
                status: appointment_entity_1.AppointmentStatus.CONFIRMED,
            },
            order: { startTime: 'ASC' },
        });
    }
    async getTodayAppointments() {
        const today = (0, date_fns_1.format)(new Date(), 'yyyy-MM-dd');
        return this.appointmentsRepository.find({
            where: {
                date: today,
                status: appointment_entity_1.AppointmentStatus.CONFIRMED,
            },
            relations: ['doctor'],
            order: { startTime: 'ASC' },
        });
    }
    async getAppointmentsForReminders() {
        const tomorrow = (0, date_fns_1.format)((0, date_fns_1.addMinutes)(new Date(), 24 * 60), 'yyyy-MM-dd');
        return this.appointmentsRepository.find({
            where: {
                date: tomorrow,
                status: appointment_entity_1.AppointmentStatus.CONFIRMED,
                reminderSent: false,
            },
            relations: ['doctor'],
        });
    }
    async markReminderSent(id) {
        await this.appointmentsRepository.update(id, { reminderSent: true });
    }
    async getAvailableDoctorsAtSlot(date, time) {
        const timeNorm = time?.length === 5 ? time : (time || '').substring(0, 5);
        if (!timeNorm || !date)
            return [];
        const timeDb = toTimeString(time);
        const { data: doctors } = await this.doctorsService.findAll({
            page: 1,
            limit: 100,
            sortBy: 'name',
            sortOrder: 'asc',
        });
        const available = [];
        for (const doctor of doctors) {
            const slots = await this.doctorsService.getAvailableSlots(doctor.id, date);
            const hasSlot = slots.some((s) => {
                const st = s.startTime?.length === 5 ? s.startTime : (s.startTime || '').substring(0, 5);
                return st === timeNorm;
            });
            if (!hasSlot)
                continue;
            const booked = await this.appointmentsRepository.findOne({
                where: {
                    doctorId: doctor.id,
                    date,
                    startTime: timeDb,
                    status: appointment_entity_1.AppointmentStatus.PENDING,
                },
            });
            if (booked)
                continue;
            const confirmed = await this.appointmentsRepository.findOne({
                where: {
                    doctorId: doctor.id,
                    date,
                    startTime: timeDb,
                    status: appointment_entity_1.AppointmentStatus.CONFIRMED,
                },
            });
            if (confirmed)
                continue;
            available.push(doctor);
        }
        return available;
    }
};
exports.AppointmentsService = AppointmentsService;
exports.AppointmentsService = AppointmentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(appointment_entity_1.Appointment)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        doctors_service_1.DoctorsService])
], AppointmentsService);
//# sourceMappingURL=appointments.service.js.map