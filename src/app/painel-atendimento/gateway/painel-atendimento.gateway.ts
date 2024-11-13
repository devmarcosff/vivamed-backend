import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { PainelAtendimentoService } from '../painel-atendimento.service';

@WebSocketGateway({
    cors: {
        origin: '*', // Ajuste o CORS conforme necessário
    },
})
export class PainelAtendimentoGateway {
    @WebSocketServer()
    server: Server;

    constructor(private readonly painelService: PainelAtendimentoService) { }

    @SubscribeMessage('generateTicket')
    async handleGenerateTicket() {
        const novoAtendimento = await this.painelService.createTicket();
        this.server.emit('ticketListUpdated', await this.painelService.getAllTickets());
        return novoAtendimento;
    }

    @SubscribeMessage('startAttendance')
    async handleStartAttendance(@MessageBody() data: { id: string; sala: string }) {
        const atendimento = await this.painelService.startAttendance(data.id, data.sala);
        this.server.emit('ticketListUpdated', await this.painelService.getAllTickets());
        return atendimento;
    }

    // @SubscribeMessage('startAttendance')
    // async handleStartAttendance(@MessageBody() createPainelAtendimentoDto: CreatePainelAtendimentoDto) {
    //     const atendimento = await this.painelService.startAttendance(createPainelAtendimentoDto);
    //     this.server.emit('ticketListUpdated', await this.painelService.getAllTickets());
    //     return atendimento;
    // }

    @SubscribeMessage('finishAttendance')
    async handleFinishAttendance(@MessageBody() data: { id: string }) {
        const atendimento = await this.painelService.finishAttendance(data.id);
        this.server.emit('ticketListUpdated', await this.painelService.getAllTickets());
        return atendimento;
    }

    @SubscribeMessage('getTicketList')
    async handleGetTicketList() {
        return await this.painelService.getAllTickets();
    }
}
