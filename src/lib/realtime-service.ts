import { io, Socket } from "socket.io-client";

export interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

export interface RealTimeUpdate {
  type: "application_status" | "scholarship_approved" | "payment_received" | "system_alert";
  data: any;
  timestamp: Date;
}

export class RealTimeService {
  private static socket: Socket | null = null;
  private static listeners: Map<string, Function[]> = new Map();
  private static isConnected = false;

  static connect(userId?: string) {
    if (this.socket && this.isConnected) {
      return;
    }

    this.socket = io(process.env.NEXT_PUBLIC_WS_URL || "http://localhost:3001", {
      auth: {
        userId,
      },
    });

    this.socket.on("connect", () => {
      console.log("Connected to real-time service");
      this.isConnected = true;
      this.emit("user_connected", { userId });
    });

    this.socket.on("disconnect", () => {
      console.log("Disconnected from real-time service");
      this.isConnected = false;
    });

    this.socket.on("notification", (data: Notification) => {
      this.notifyListeners("notification", data);
    });

    this.socket.on("update", (data: RealTimeUpdate) => {
      this.notifyListeners("update", data);
    });

    this.socket.on("error", (error: any) => {
      console.error("Real-time service error:", error);
    });
  }

  static disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  static subscribe(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);

    // Return unsubscribe function
    return () => {
      const callbacks = this.listeners.get(event);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    };
  }

  private static notifyListeners(event: string, data: any) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error("Error in real-time listener:", error);
        }
      });
    }
  }

  static emit(event: string, data: any) {
    if (this.socket && this.isConnected) {
      this.socket.emit(event, data);
    }
  }

  static isSocketConnected(): boolean {
    return this.isConnected;
  }

  // Convenience methods for specific events
  static onNotification(callback: (notification: Notification) => void) {
    return this.subscribe("notification", callback);
  }

  static onUpdate(callback: (update: RealTimeUpdate) => void) {
    return this.subscribe("update", callback);
  }

  static onApplicationStatusChange(callback: (data: any) => void) {
    return this.subscribe("application_status", callback);
  }

  static onScholarshipApproved(callback: (data: any) => void) {
    return this.subscribe("scholarship_approved", callback);
  }

  static onPaymentReceived(callback: (data: any) => void) {
    return this.subscribe("payment_received", callback);
  }

  // Send notifications to specific users
  static sendNotification(userId: string, notification: Omit<Notification, "id" | "timestamp" | "read">) {
    this.emit("send_notification", {
      userId,
      notification: {
        ...notification,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date(),
        read: false,
      },
    });
  }

  // Broadcast updates to all connected users
  static broadcastUpdate(update: Omit<RealTimeUpdate, "timestamp">) {
    this.emit("broadcast_update", {
      ...update,
      timestamp: new Date(),
    });
  }
}

